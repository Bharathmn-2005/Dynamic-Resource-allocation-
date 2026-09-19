package com.example.booking_service.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "bookings")

public class BookingEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = true, length = 30)
        private String bookingReference;

        @Column(nullable = false, unique = true, length = 15)
        private String pnr;

        @Column(nullable = false)
        private Long userId;

        @Column(nullable = false)
        private String userEmail;

        @Column(nullable = false)
        private String passengerName;

        @Column(nullable = false)
        private Integer age;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private Gender gender;

        @Column(nullable = false)
        private LocalDate travelDate;

        @Column
        private String seatNumber;

        @Column(nullable = false)
        private Long trainId;

        @Column(nullable = false)
        private Integer trainNumber;

        @Column(nullable = false)
        private String trainName;

        @Column(nullable = false)
        private String source;

        @Column(nullable = false)
        private String destination;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private TrainClass trainClass;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private BookingQuota quota;

        @Column(nullable = false)
        private LocalDate journeyDate;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal fare;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private BookingStatus bookingStatus;

        @Column
        private LocalDateTime ticketPdfSentAt;

        @Column(nullable = false, updatable = false)
        private LocalDateTime bookingTime;

        @Column(nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @Column(nullable = false)
        private LocalDateTime updatedAt;

        public BookingEntity() {
        }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getPnr() {
        return pnr;
    }

    public void setPnr(String pnr) {
        this.pnr = pnr;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Long getTrainId() {
        return trainId;
    }

    public void setTrainId(Long trainId) {
        this.trainId = trainId;
    }

    public Integer getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(Integer trainNumber) {
        this.trainNumber = trainNumber;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public TrainClass getTrainClass() {
        return trainClass;
    }

    public void setTrainClass(TrainClass trainClass) {
        this.trainClass = trainClass;
    }

    public BookingQuota getQuota() {
        return quota;
    }

    public void setQuota(BookingQuota quota) {
        this.quota = quota;
    }

    public LocalDate getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(LocalDate journeyDate) {
        this.journeyDate = journeyDate;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getTicketPdfSentAt() {
        return ticketPdfSentAt;
    }

    public void setTicketPdfSentAt(LocalDateTime ticketPdfSentAt) {
        this.ticketPdfSentAt = ticketPdfSentAt;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

        @PrePersist
        public void onCreate() {
            bookingTime = LocalDateTime.now();
            createdAt = LocalDateTime.now();
            updatedAt = LocalDateTime.now();

            if (bookingStatus == null) {
                bookingStatus = BookingStatus.CONFIRMED;
            }
        }

        @PreUpdate
        public void onUpdate() {
            updatedAt = LocalDateTime.now();
        }
}
