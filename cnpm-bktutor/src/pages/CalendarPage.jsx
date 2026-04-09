import React, { useState, useEffect, useMemo } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";

// === 1. IMPORT NAVIGATION BAR TỪ ĐƯỜNG DẪN CUNG CẤP ===
import NavigationBar from "../components/navigationbar.jsx"; 

const API_BASE_URL = "http://localhost:8080";

// =======================================================================
// === 2. COMPONENTS POP-UP (GIỮ NGUYÊN) ===
// =======================================================================

// --- Pop-up Chi tiết Sự kiện ---
const EventDetailPopup = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 p-6">
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <h3 className="text-2xl font-bold text-blue-700">{event.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Thời gian:</span> {format(event.dateObject, "EEEE, dd/MM/yyyy", { locale: vi })}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Giờ:</span> {event.formattedTime}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Giảng viên:</span> <span className="text-lg font-medium text-red-600">{event.lecturer || event.tutor || "Chưa xác định"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Phòng/Địa điểm:</span> <span className="text-lg font-medium text-purple-600">{event.room}</span>
          </p>
          {event.description && (
            <p>
              <span className="font-semibold text-gray-900">Chi tiết:</span> {event.description}
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Pop-up Tất cả Sự kiện trong ngày ---
const AllEventsPopup = ({ day, events, onClose }) => {
  if (!day || events.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 p-6">
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <h3 className="text-2xl font-bold text-blue-700">Tất cả sự kiện ngày {format(day, "dd/MM/yyyy")}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border-l-4 border-green-600 shadow-md transition duration-150"
            >
              <div className="font-bold text-lg text-green-900">{event.title}</div>
              <div className="text-sm text-green-700 mt-1">
                <span className="font-semibold">Thời gian:</span> {event.formattedTime}
              </div>
              <div className="text-sm text-red-600">
                <span className="font-semibold">Giảng viên:</span> <span className="font-medium">{event.lecturer || event.tutor || "Chưa xác định"}</span>
              </div>
              <div className="text-sm text-green-700">
                <span className="font-semibold">Phòng:</span> <span className="font-medium">{event.room}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};


// =======================================================================
// === 3. COMPONENTS PHỤ (GIỮ NGUYÊN) ===
// =======================================================================

const CalendarHeader = ({ currentDate, changeMonth, locale }) => {
  const prevMonth = subMonths(currentDate, 1);
  const nextMonth = addMonths(currentDate, 1);

  const formatMonth = (date) =>
    format(date, "MMMM", { locale }).charAt(0).toUpperCase() + format(date, "MMMM", { locale }).slice(1);

  return (
    <div className="flex justify-between items-center px-4 pt-4 pb-2 bg-blue-600 border-b border-blue-700">
      <button onClick={() => changeMonth(-1)} className="text-blue-100 font-semibold text-sm hover:text-white flex items-center p-2 rounded-lg">
        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {formatMonth(prevMonth)}
      </button>

      <h2 className="text-xl font-bold text-white uppercase tracking-wider">
        {format(currentDate, "MMMM yyyy", { locale })}
      </h2>

      <button onClick={() => changeMonth(1)} className="text-blue-100 font-semibold text-sm hover:text-white flex items-center p-2 rounded-lg">
        {formatMonth(nextMonth)}
        <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const CalendarDaysHeader = () => {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return (
    <div className="grid grid-cols-7 text-center font-bold text-blue-800 border-b border-gray-200 bg-blue-50">
      {days.map((day, i) => (
        <div key={day} className={clsx("py-2 text-sm border-r border-gray-200", i === 6 && "border-r-0")}>
          {day}
        </div>
      ))}
    </div>
  );
};

// --- CẬP NHẬT: Thêm hiển thị tên giảng viên trong ô lịch ---
const CalendarCells = ({ calendarData, currentDate, today, events, openDetailPopup, openAllEventsPopup }) => {
  const getEventsForDay = (day) => events.filter((e) => isSameDay(e.dateObject, day));
  const limit = 2; 

  return (
    <div className="grid grid-cols-7 border-l border-b border-gray-300">
      {calendarData.flat().map((day, idx) => {
        const dayEvents = getEventsForDay(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isToday = isSameDay(day, today);

        return (
          <div
            key={idx}
            className={clsx(
              "min-h-[130px] p-2 border-t border-gray-300 transition",
              (idx + 1) % 7 === 0 ? "border-r-0" : "border-r",
              !isCurrentMonth ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-blue-50"
            )}
          >
            {/* Số ngày */}
            <div className="text-right pr-1">
              <span
                className={clsx(
                  "inline-block px-2 py-1 text-lg font-bold rounded-full",
                  isToday && isCurrentMonth
                    ? "bg-blue-600 text-white"
                    : !isCurrentMonth
                    ? "text-gray-400"
                    : "text-gray-900"
                )}
              >
                {format(day, "d")}
              </span>
            </div>

            {/* Danh sách sự kiện */}
            <div className="mt-2 space-y-1.5 text-xs">
              {dayEvents.slice(0, limit).map((event) => (
                <div
                  key={event.id}
                  onClick={() => openDetailPopup(event)} 
                  className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-md p-2 border-l-4 border-blue-600 cursor-pointer shadow-sm"
                  title={`${event.title} - GV: ${event.lecturer || event.tutor || 'Chưa xác định'}`}
                >
                  <div className="font-semibold text-blue-900 truncate">{event.title}</div>
                  <div className="text-blue-700 mt-1">
                    <span className="block">{event.formattedTime}</span>
                    {/* SỬ DỤNG TRƯỜNG LECTURER HOẶC TUTOR CÓ SẴN */}
                    <span className="font-medium text-red-600 truncate block mt-1">
                      {event.lecturer || event.tutor || "Chưa xác định"}
                    </span>
                  </div>
                </div>
              ))}

              {/* Button mở Tất cả sự kiện */}
              {dayEvents.length > limit && (
                <button
                  onClick={() => openAllEventsPopup(day, dayEvents)}
                  className="w-full text-blue-600 font-bold text-xs pt-1 text-left hover:text-blue-800 transition"
                >
                  + {dayEvents.length - limit} sự kiện nữa
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =======================================================================
// === 4. COMPONENT CHÍNH ĐÃ BỎ LOGIC FETCH TUTOR ID ===
// =======================================================================
export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();

  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [allEventsPopupData, setAllEventsPopupData] = useState(null); 

  const openDetailPopup = (event) => setSelectedEvent(event);
  const closeDetailPopup = () => setSelectedEvent(null);

  const openAllEventsPopup = (day, events) => setAllEventsPopupData({ day, events });
  const closeAllEventsPopup = () => setAllEventsPopupData(null);


  useEffect(() => {
    const fetchEvents = async () => {
        try {
          setLoading(true);
          setError(null);
  
          // 1. FETCH DANH SÁCH SỰ KIỆN GỐC
          const eventsResponse = await fetch(`${API_BASE_URL}/api/events`, {
            method: "GET",
            credentials: "include", 
          });
  
          if (!eventsResponse.ok) {
            if (eventsResponse.status === 401) {
              setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            } else {
              throw new Error(`HTTP ${eventsResponse.status}`);
            }
            return;
          }
  
          // Lấy dữ liệu sự kiện
          const eventsData = await eventsResponse.json();
  
          // *** LOẠI BỎ TOÀN BỘ LOGIC FETCH TÊN GIẢNG VIÊN DỰA TRÊN tutorid ***
          // *** GIẢ ĐỊNH DỮ LIỆU GỐC ĐÃ CÓ TRƯỜNG TÊN GIẢNG VIÊN (lecturer/tutor) ***
  
          // 2. XỬ LÝ FORMAT NGÀY/GIỜ TRỰC TIẾP
          const processedEvents = eventsData.map((event) => {
            const dateObj = parseISO(event.date); 
            const startTime = parseISO(event.timestart);
            const endTime = parseISO(event.timeend);
  
            return {
              ...event,
              dateObject: dateObj,
              formattedTime: `${format(startTime, "HH:mm")} → ${format(endTime, "HH:mm")}`,
              // Đảm bảo trường lecturer/tutor được giữ lại từ dữ liệu gốc
              lecturer: event.lecturer || event.tutor || "Chưa xác định", 
            };
          });
  
          setEvents(processedEvents);
        } catch (err) {
          console.error("Lỗi tải lịch:", err);
          setError("Không thể kết nối đến server. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }
      };

    fetchEvents();
  }, []); 

  // Tính lưới lịch (Không đổi)
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let day = startDate;
    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      rows.push(week);
    }
    return rows;
  }, [currentDate]);

  const changeMonth = (dir) => {
    setCurrentDate(addMonths(currentDate, dir));
  };


  return (
    <>
      <NavigationBar/> 
      
      <div className="bg-gray-50 min-h-screen p-8 pt-[64px]"> 
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">Lịch Học Tập</h1>

        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-500">
          <CalendarHeader currentDate={currentDate} changeMonth={changeMonth} locale={vi} />
          
          <div>
            <CalendarDaysHeader />

            {loading && (
              <div className="p-16 text-center text-xl text-gray-600">Đang tải lịch học...</div>
            )}
            {error && (
              <div className="p-16 text-center text-xl text-red-600 bg-red-50">{error}</div>
            )}
            {!loading && !error && events.length === 0 && (
              <div className="p-16 text-center text-xl text-gray-500">Không có lịch học nào sắp tới.</div>
            )}

            {!loading && !error && (
              <CalendarCells
                calendarData={calendarData}
                currentDate={currentDate}
                today={today}
                events={events}
                openDetailPopup={openDetailPopup} 
                openAllEventsPopup={openAllEventsPopup} 
              />
            )}
          </div>
        </div>

        <EventDetailPopup event={selectedEvent} onClose={closeDetailPopup} />
        
        {allEventsPopupData && (
          <AllEventsPopup
            day={allEventsPopupData.day}
            events={allEventsPopupData.events}
            onClose={closeAllEventsPopup}
          />
        )}
      </div>
    </>
  );
}