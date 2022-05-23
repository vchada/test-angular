package com.calander.schedule.service;

import com.calander.schedule.beans.CalenderScheduleRequest;
import com.calander.schedule.beans.StatusResponse;
import com.calander.schedule.entity.CalendarSchedule;
import com.calander.schedule.repo.CalenderScheduleRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class CalenderScheduleService {

    private final CalenderScheduleRepo calenderScheduleRepo;

    public CalenderScheduleService(final CalenderScheduleRepo calenderScheduleRepo) {
        this.calenderScheduleRepo = calenderScheduleRepo;
    }

    public StatusResponse persistCalenderSchedule(final CalenderScheduleRequest calenderScheduleRequest) {
        if(Objects.nonNull(calenderScheduleRequest)) {
            final CalendarSchedule calendarSchedule = CalendarSchedule.builder()
                    .createdUser(calenderScheduleRequest.getCreatedUser())
                    .name(calenderScheduleRequest.getName())
                    .RuleIds(calenderScheduleRequest.getRuleIds())
                    .isActive(true)
                    .lastModifiedUser(calenderScheduleRequest.getLastModifiedUser())
                    .build();
            calenderScheduleRepo.save(calendarSchedule);
            return StatusResponse.builder().message("CALENDER_PERSISTED_SUCCESSFULLY").build();

        }
        return StatusResponse.builder().message("CALENDER_PERSIST_FAILED").build();
    }
    
    public StatusResponse updateCalendarSchedule(final CalendarSchedule calenderScheduleRequest) {
		Optional<CalendarSchedule> searchRuleEntity = calenderScheduleRepo.findById(calenderScheduleRequest.getId());
		
		if(searchRuleEntity.isPresent()) {
			calenderScheduleRepo.save(calenderScheduleRequest);
			return StatusResponse.builder().message("CALENDAR UPDATED SUCCESSFULLY").build();
		}
		return StatusResponse.builder().message("CALENDAR UPDATED SUCCESSFULLY").build();
    }

    public List<CalendarSchedule> getAllCalendars(String year)
    {
        return StreamSupport.stream(calenderScheduleRepo.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }
}
