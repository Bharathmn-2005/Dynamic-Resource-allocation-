package com.example.booking_service.Mapper;

import com.example.booking_service.DTO.BookingConfirmationDTO;
import com.example.booking_service.DTO.BookingRequestDTO;
import com.example.booking_service.DTO.BookingResponseDTO;
import com.example.booking_service.DTO.PassengerDTO;
import com.example.booking_service.model.BookingEntity;
import com.example.booking_service.model.Passenger;

import java.util.List;
import java.util.stream.Collectors;

public class BookingMapper {

    public static BookingConfirmationDTO toConfirmationDTO(BookingEntity booking, List<Passenger> passengers) {
        BookingConfirmationDTO dto = new BookingConfirmationDTO();
        
        dto.setPnr(booking.getPnr());
        dto.setTrainName(booking.getTrainName());
        dto.setTrainNumber(booking.getTrainNumber());
        dto.setSource(booking.getSource());
        dto.setDestination(booking.getDestination());
        dto.setJourneyDate(booking.getJourneyDate());
        dto.setDepartureTime(booking.getCreatedAt());
        dto.setArrivalTime(booking.getUpdatedAt());
        dto.setFare(booking.getFare());
        dto.setStatus(booking.getBookingStatus());
        dto.setBookingTime(booking.getBookingTime());
        dto.setMessage("Booking confirmed successfully. Your PNR is " + booking.getPnr());
        
        List<PassengerDTO> passengerDTOs = passengers.stream()
                .map(p -> new PassengerDTO(p.getPassengerName(), p.getAge(), p.getGender()))
                .collect(Collectors.toList());
        dto.setPassengers(passengerDTOs);
        
        return dto;
    }

    public static Passenger toPassengerEntity(Long bookingId, PassengerDTO dto) {
        Passenger passenger = new Passenger(bookingId, dto.getName(), dto.getAge(), dto.getGender());
        passenger.setSeatNumber(dto.getSeatNumber());
        return passenger;
    }

    public static Passenger toPassengerEntity(Long bookingId, String name, Integer age, com.example.booking_service.model.Gender gender, String seatNumber) {
        Passenger passenger = new Passenger(bookingId, name, age, gender);
        passenger.setSeatNumber(seatNumber);
        return passenger;
    }

    public static BookingEntity toEntity(BookingRequestDTO request) {
        BookingEntity booking = new BookingEntity();
        booking.setTrainId(request.getTrainId());
        booking.setJourneyDate(request.getTravelDate());
        booking.setTravelDate(request.getTravelDate());
        booking.setPassengerName(request.getPassengerName());
        booking.setAge(request.getAge());
        booking.setGender(request.getGender());
        return booking;
    }

        public static BookingResponseDTO toDTO(BookingEntity booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setPassengerName(booking.getPassengerName());
        dto.setSeatNumber(booking.getSeatNumber());
        dto.setBookingStatus(booking.getBookingStatus());
        return dto;
    }
}