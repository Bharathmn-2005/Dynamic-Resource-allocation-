package com.example.booking_service.Service;

import com.example.booking_service.DTO.BookingRequestDTO;
import com.example.booking_service.DTO.BookingResponseDTO;
import com.example.booking_service.DTO.MyBookingDTO;
import com.example.booking_service.DTO.PassengerDTO;
import com.example.booking_service.client.NotificationClient;
import com.example.booking_service.client.dto.BookingFailureNotificationRequest;
import com.example.booking_service.client.dto.BookingSuccessNotificationRequest;
import com.example.booking_service.Mapper.BookingMapper;
import com.example.booking_service.Repository.BookingRepository;
import com.example.booking_service.Repository.PassengerRepository;
import com.example.booking_service.Repository.TrainRepository;
import com.example.booking_service.exception.BookingNotFoundException;
import com.example.booking_service.exception.InvalidPassengerException;
import com.example.booking_service.exception.SeatNotAvailableException;
import com.example.booking_service.exception.UnauthorizedBookingException;
import com.example.booking_service.model.BerthPreference;
import com.example.booking_service.model.BookingEntity;
import com.example.booking_service.model.BookingQuota;
import com.example.booking_service.model.BookingStatus;
import com.example.booking_service.model.Gender;
import com.example.booking_service.model.Passenger;
import com.example.booking_service.model.TrainClass;
import com.example.booking_service.model.TrainDetails;
import com.example.booking_service.model.TrainStatus;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingRepository bookingRepo;
    private final TrainRepository trainRepo;
    private final PassengerRepository passengerRepo;
    private final NotificationClient notificationClient;
    private final PnrGeneratorService pnrGeneratorService;
    private final Map<String, ReentrantLock> bookingLocks = new ConcurrentHashMap<>();

    public BookingService(BookingRepository bookingRepo,
                          TrainRepository trainRepo,
                          PassengerRepository passengerRepo,
                          NotificationClient notificationClient,
                          PnrGeneratorService pnrGeneratorService) {
        this.bookingRepo = bookingRepo;
        this.trainRepo = trainRepo;
        this.passengerRepo = passengerRepo;
        this.notificationClient = notificationClient;
        this.pnrGeneratorService = pnrGeneratorService;
    }

    @Transactional
    public BookingResponseDTO bookTicket(
            Authentication authentication,
            BookingRequestDTO request) {

        TrainDetails train = null;
        ReentrantLock lock = bookingLockFor(request.getTrainId(), request.getTravelDate());
        lock.lock();

        try {
            train = trainRepo.findById(request.getTrainId())
                    .orElseThrow(() ->
                            new com.example.booking_service.exception.TrainNotFoundException(
                                    "Train not found with id: " + request.getTrainId()));

            if (train.getStatus() != TrainStatus.ACTIVE) {
                throw new RuntimeException("Train is not available for booking");
            }

            List<PassengerDTO> passengers = resolvePassengers(request);
            if (passengers.isEmpty()) {
                throw new RuntimeException("At least one passenger is required");
            }
            int passengerCount = passengers.size();

            if (train.getAvailableSeats() < passengerCount) {
                throw new SeatNotAvailableException(
                        "Only " + train.getAvailableSeats() + " seat(s) left. Please refresh availability.");
            }

            List<String> seats = resolveSeats(request, passengers.size(), train, request.getTravelDate());

            BookingEntity booking = BookingMapper.toEntity(request);
            booking.setTrainId(train.getId());
            PassengerDTO primary = passengers.get(0);
            booking.setPassengerName(primary.getName());
            booking.setAge(primary.getAge());
            booking.setGender(primary.getGender() != null ? primary.getGender() : Gender.MALE);
            booking.setUserEmail(authentication.getName());
            booking.setUserId(resolveUserId(authentication));
            booking.setPnr(pnrGeneratorService.generatePnr());
            booking.setBookingReference("BK" + System.currentTimeMillis());
            booking.setTrainNumber(train.getTrainNumber());
            booking.setTrainName(train.getTrainName());
            booking.setSource(train.getSource());
            booking.setDestination(train.getDestination());
            booking.setFare(train.getFare().multiply(BigDecimal.valueOf(passengerCount)));
            booking.setSeatNumber(String.join(", ", seats));
            booking.setTrainClass(TrainClass.CC);
            booking.setQuota(BookingQuota.GENERAL);
            booking.setBookingStatus(BookingStatus.CONFIRMED);

            train.setAvailableSeats(train.getAvailableSeats() - passengerCount);
            trainRepo.save(train);

            BookingEntity savedBooking = bookingRepo.save(booking);

            List<Passenger> savedPassengers = new ArrayList<>();
            for (int i = 0; i < passengers.size(); i++) {
                PassengerDTO pd = passengers.get(i);
                savedPassengers.add(BookingMapper.toPassengerEntity(
                        savedBooking.getId(),
                        pd.getName(),
                        pd.getAge(),
                        pd.getGender() != null ? pd.getGender() : Gender.MALE,
                        seats.get(i)));
            }
            passengerRepo.saveAll(savedPassengers);

            BookingResponseDTO response = BookingMapper.toDTO(savedBooking);
            response.setMessage("Ticket booked successfully");

            notificationClient.sendBookingSuccess(
                    new BookingSuccessNotificationRequest(
                            savedBooking.getId(),
                            resolveUserId(authentication),
                            authentication.getName(),
                            train.getTrainName(),
                            train.getSource() + " to " + train.getDestination(),
                            request.getTravelDate().toString(),
                            String.join(", ", seats),
                            train.getFare().multiply(BigDecimal.valueOf(passengerCount)).doubleValue()
                    )
            );

            return response;
        } catch (RuntimeException ex) {
            notificationClient.sendBookingFailure(
                    new BookingFailureNotificationRequest(
                            request.getTrainId(),
                            resolveUserId(authentication),
                            authentication.getName(),
                            train != null ? train.getTrainName() : "Unknown Train",
                            ex.getMessage()
                    )
            );
            throw ex;
        } finally {
            lock.unlock();
        }
    }

    private List<PassengerDTO> resolvePassengers(BookingRequestDTO request) {
        List<PassengerDTO> result = new ArrayList<>();
        if (request.getPassengers() != null && !request.getPassengers().isEmpty()) {
            for (PassengerDTO p : request.getPassengers()) {
                if (p.getName() == null || p.getName().isBlank()) {
                    throw new InvalidPassengerException("Passenger name is required");
                }
                if (p.getAge() == null || p.getAge() < 1) {
                    throw new InvalidPassengerException("Passenger age is invalid");
                }
                result.add(p);
            }
            return result;
        }
        // Legacy single-passenger request.
        PassengerDTO single = new PassengerDTO(
                request.getPassengerName(), request.getAge(), request.getGender());
        result.add(single);
        return result;
    }

    /**
     * Allocates the next available seats based on the user's berth preference.
     * The user is not allowed to manually select a seat; the system assigns one
     * that matches the preferred berth when possible and falls back to any open seat.
     */
    private List<String> resolveSeats(BookingRequestDTO request, int count,
                                      TrainDetails train, LocalDate journeyDate) {
        List<String> requested = request.getSeatNumbers();
        if (requested != null && !requested.isEmpty()) {
            if (requested.size() != count) {
                throw new SeatNotAvailableException(
                        "Seat count must match the passenger count.");
            }
            Set<String> normalized = new HashSet<>();
            Set<String> alreadyBooked = bookedSeats(train.getId(), journeyDate);
            for (String seat : requested) {
                String s = seat.trim().toUpperCase();
                if (s.isEmpty()) {
                    throw new SeatNotAvailableException("A selected seat is empty.");
                }
                if (!normalized.add(s)) {
                    throw new SeatNotAvailableException("Duplicate seat selected: " + s);
                }
                if (alreadyBooked.contains(s)) {
                    throw new SeatNotAvailableException(
                            "Seat " + s + " was just booked by another user. Please refresh availability.");
                }
            }
            return new ArrayList<>(normalized);
        }

        BerthPreference preference = request.getBerthPreference();
        Set<String> alreadyBooked = bookedSeats(train.getId(), journeyDate);
        List<String> auto = new ArrayList<>();

        List<String> preferredPool = preferredSeatPool(preference);
        for (String seat : preferredPool) {
            if (auto.size() >= count) {
                break;
            }
            if (!alreadyBooked.contains(seat)) {
                auto.add(seat);
            }
        }

        if (auto.size() < count) {
            for (int i = 1; i <= 200; i++) {
                String seat = "S" + i;
                if (auto.size() >= count) {
                    break;
                }
                if (!alreadyBooked.contains(seat) && !preferredPool.contains(seat)) {
                    auto.add(seat);
                }
            }
        }

        if (auto.size() < count) {
            throw new SeatNotAvailableException("Seat allocation failed for the requested berth preference. Please retry.");
        }

        return auto;
    }

    private List<String> preferredSeatPool(BerthPreference preference) {
        return switch (preference) {
            case LOWER -> List.of("L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10");
            case MIDDLE -> List.of("M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10");
            case UPPER -> List.of("U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10");
            case SIDE_LOWER -> List.of("SL1", "SL2", "SL3", "SL4", "SL5", "SL6", "SL7", "SL8", "SL9", "SL10");
            case SIDE_UPPER -> List.of("SU1", "SU2", "SU3", "SU4", "SU5", "SU6", "SU7", "SU8", "SU9", "SU10");
        };
    }

    private ReentrantLock bookingLockFor(Long trainId, LocalDate travelDate) {
        String key = trainId + ":" + travelDate;
        return bookingLocks.computeIfAbsent(key, ignored -> new ReentrantLock());
    }

    private Set<String> bookedSeats(Long trainId, LocalDate journeyDate) {
        Set<String> seats = new HashSet<>();
        List<BookingEntity> existing =
                bookingRepo.findByTrainIdAndJourneyDate(trainId, journeyDate);
        for (BookingEntity b : existing) {
            List<Passenger> ps = passengerRepo.findByBookingId(b.getId());
            for (Passenger p : ps) {
                if (p.getSeatNumber() != null && !p.getSeatNumber().isBlank()) {
                    seats.add(p.getSeatNumber().trim().toUpperCase());
                }
            }
        }
        return seats;
    }

    /**
     * Returns all bookings belonging to the authenticated user.
     */
    @Transactional
    public List<MyBookingDTO> getUserBookings(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        String email = authentication.getName();

        Set<BookingEntity> bookings = new HashSet<>();
        if (userId != null && userId > 0) {
            bookings.addAll(bookingRepo.findByUserId(userId));
        }
        if (email != null && !email.isBlank()) {
            bookings.addAll(bookingRepo.findByUserEmail(email));
        }

        return bookings.stream()
                .map(b -> MyBookingDTO.fromEntity(b, passengerRepo.findByBookingId(b.getId())))
                .collect(Collectors.toList());
    }

    /**
     * Fetches a booking owned by the authenticated user.
     * Used by the Payment Service to validate bookings for payment initiation.
     */
    @Transactional
    public BookingEntity getOwnedBooking(Long bookingId, Authentication authentication) {
        BookingEntity booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        boolean isOwner = booking.getUserEmail().equalsIgnoreCase(authentication.getName())
                || booking.getUserId().equals(resolveUserId(authentication));

        if (!isOwner) {
            throw new UnauthorizedBookingException("You do not have access to this booking");
        }

        return booking;
    }

    private Long resolveUserId(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof com.example.booking_service.security.BookingPrincipal bookingPrincipal) {
            return bookingPrincipal.getId();
        }

        return 0L;
    }
}
