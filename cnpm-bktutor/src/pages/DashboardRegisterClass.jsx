import React, { useState, useEffect, useMemo } from 'react';

import NavigationBar from "../components/navigationbar.jsx"; 
// URL cơ sở cho API
const API_BASE_URL = 'http://localhost:8080';
const SESSIONS_PER_PAGE = 10; // Giới hạn 10 buổi học mỗi trang

// Hàm tiện ích để định dạng chuỗi ISO sang HH:MM
const formatIsoTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        // Định dạng thành HH:MM (24 giờ)
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false 
        });
    } catch (e) {
        // Trả về chuỗi ban đầu nếu định dạng thất bại
        return isoString.substring(0, 16).replace('T', ' '); 
    }
};

// Hàm tiện ích để định dạng chuỗi ISO sang DD/MM/YYYY (MỚI)
const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    // Giả định isoString là định dạng YYYY-MM-DD
    try {
        const parts = isoString.split('-');
        if (parts.length === 3) {
            // Chuyển sang DD/MM/YYYY
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        // Nếu không đúng định dạng YYYY-MM-DD, thử chuyển thành Date object
        const dateObj = new Date(isoString);
        return dateObj.toLocaleDateString('vi-VN');
    } catch (e) {
        return isoString;
    }
};


// --- 1. CourseCard Component ---
const CourseCard = ({ session, onSubscribe, onUnsubscribe }) => {
    const {
        id,
        title, 
        tutorname,
        major,
        status,
        date, // <<< THÊM DATE VÀO PROPS
        timestart,
        timeend,
        room, 
        capacity,
        num_joined,
        eventid
    } = session;

    // Định dạng ngày
    const formattedDate = formatDate(date); // <<< DÙNG HÀM MỚI

    const formattedTimeStart = formatIsoTime(timestart);
    const formattedTimeEnd = formatIsoTime(timeend);
    const timeRange = `${formattedTimeStart} - ${formattedTimeEnd}`; 
    const joinedCount = `${num_joined}/${capacity}`; 
    // Sử dụng eventid để nhất quán với API
    const actionId = eventid || id; 

    // Phân loại trạng thái và màu sắc
    let statusDisplay = '';
    let statusColorClass = '';
    let actionButton = null;

    switch (status) {
        case 'available':
            statusDisplay = 'Sẵn sàng';
            statusColorClass = 'text-green-600'; 
            actionButton = (
                <button
                    className="w-full px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-150 transform hover:scale-[1.02]"
                    onClick={() => onSubscribe(actionId)}
                >
                    Đăng ký tham gia
                </button>
            );
            break;

        case 'joined':
            statusDisplay = 'Đã tham gia';
            statusColorClass = 'text-blue-600'; 
            actionButton = (
                <button
                    className="w-full px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-[1.02]"
                    onClick={() => onUnsubscribe(actionId)}
                >
                    Hủy đăng ký
                </button>
            );
            break;

        case 'completed':
            statusDisplay = 'Hoàn thành';
            statusColorClass = 'text-gray-500'; 
            actionButton = (
                <span className="text-sm text-gray-500 font-medium p-2 block text-center border border-gray-200 rounded-lg">
                    Buổi học đã hoàn thành
                </span>
            );
            break;
            
        default:
            statusDisplay = 'Không rõ';
            statusColorClass = 'text-yellow-600';
    }


    return (
        <div className="relative p-4 bg-white rounded-lg shadow-lg border border-gray-100 transition duration-200 hover:shadow-xl flex flex-col justify-between h-full">
            <div>
                {/* --- Tiêu đề Khóa học (Title) --- */}
                <h3 className="text-xl font-extrabold text-blue-800 mb-2 truncate">
                    {title || "Khóa học không có Tiêu đề"}
                </h3>

                {/* Header (Thông tin Người hướng dẫn) */}
                <div className="mb-3 border-b pb-2">
                    <p className="text-base font-semibold text-gray-700">Người hướng dẫn: {tutorname || "Tên không rõ"}</p>
                    <p className="text-sm text-gray-500">Khoa: {major || "Chuyên ngành không rõ"}</p>
                </div>
                
                {/* Body (Thông tin chi tiết) */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm items-center mb-4">
                    
                    {/* Ngày (Mục mới) */}
                    <div className="info-row">
                        <span className="text-gray-600 font-medium mr-1">Ngày:</span>
                        <span className="text-gray-800 font-bold">{formattedDate}</span> {/* <<< HIỂN THỊ DATE */}
                    </div>
                    
                    {/* Trạng thái */}
                    <div className="info-row">
                        <span className="text-gray-600 font-medium mr-1">Status:</span>
                        <span className={`font-semibold ${statusColorClass}`}>{statusDisplay}</span>
                    </div>

                    {/* Thời gian */}
                    <div className="info-row">
                        <span className="text-gray-600 font-medium mr-1">Thời gian:</span>
                        <span className="text-gray-800">{timeRange}</span>
                    </div>

                    {/* Địa điểm */}
                    <div className="info-row">
                        <span className="text-gray-600 font-medium mr-1">Phòng:</span>
                        <span className="text-gray-800 font-semibold">{room || "Chưa xác định"}</span>
                    </div>

                    {/* Số lượng */}
                    <div className="info-row">
                        <span className="text-gray-600 font-medium mr-1">Số lượng:</span>
                        <span className="text-gray-800">{joinedCount}</span>
                    </div>
                </div>
            </div>

            {/* Vùng Nút Hành động Động */}
            <div className="mt-4">
                {actionButton}
            </div>
        </div>
    );
};

// --- 2. Main App Component (Quản lý Sessions, Lọc và Phân trang) ---
const App = () => {
    // State chứa toàn bộ dữ liệu gốc từ API
    const [sessionsData, setSessionsData] = useState([]); 
    const [loading, setLoading] = useState(true);

    // States cho Filter
    const [filterText, setFilterText] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); 

    // States cho Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // --- Hàm Gọi API lấy danh sách Sessions (GET) ---
    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/sessions`, {
                method: "GET",
                credentials: "include", 
            });
            
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
            }
            
            const data = await response.json(); 
            // Giả định rằng API trả về dữ liệu đã có 'tutorname' và 'date'
            setSessionsData(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);
    
    // --- Logic Lọc và Phân trang (Sử dụng useMemo để tối ưu) ---
    const { filteredSessions, currentSessions, totalPages } = useMemo(() => {
        // 1. LỌC DỮ LIỆU
        const filtered = sessionsData.filter(session => {
            const searchLower = filterText.toLowerCase();

            // Lọc theo văn bản (Title, Tên người hướng dẫn, chuyên ngành)
            const matchesText = (
                session.title?.toLowerCase().includes(searchLower) ||
                session.tutorname?.toLowerCase().includes(searchLower) ||
                session.major?.toLowerCase().includes(searchLower)
            );

            // Lọc theo trạng thái
            const matchesStatus = filterStatus === '' || session.status === filterStatus;

            return matchesText && matchesStatus;
        });

        // 2. TÍNH TOÁN PHÂN TRANG
        const total = filtered.length;
        const pages = Math.ceil(total / SESSIONS_PER_PAGE);

        // 3. CẮT DỮ LIỆU CHO TRANG HIỆN TẠI
        const startIndex = (currentPage - 1) * SESSIONS_PER_PAGE;
        const sessionsForPage = filtered.slice(startIndex, startIndex + SESSIONS_PER_PAGE);
        
        return { 
            filteredSessions: filtered, 
            currentSessions: sessionsForPage, 
            totalPages: pages 
        };
    }, [sessionsData, filterText, filterStatus, currentPage]);

    // --- Đảm bảo trang hiện tại hợp lệ khi bộ lọc thay đổi ---
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);


    // --- Hàm Hủy đăng ký (Unsubscribe) (API: DELETE /api/sessions/<eventid>) ---
    const handleUnsubscribe = async (eventid) => {
        if (!window.confirm(`Bạn có chắc chắn muốn HỦY ĐĂNG KÝ buổi học có ID ${eventid} này?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/sessions/${eventid}`, {
                method: 'DELETE', 
                credentials: "include",
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`Hủy đăng ký thất bại: ${errorBody.message || response.statusText}`);
            }

            alert(`✅ Đã HỦY ĐĂNG KÝ thành công buổi học có ID: ${eventid}`);
            // Tải lại toàn bộ danh sách để cập nhật trạng thái
            fetchSessions(); 

        } catch (error) {
            console.error("Lỗi khi hủy đăng ký:", error);
            alert(`❌ Hủy đăng ký thất bại. Chi tiết: ${error.message}`);
        }
    };
    
    // --- Hàm Đăng ký (Subscribe) (API: POST /api/sessions/<eventid>) ---
    const handleSubscribe = async (eventid) => {
        if (!window.confirm(`Bạn có chắc chắn muốn ĐĂNG KÝ tham gia buổi học có ID ${eventid} này?`)) {
            return;
        }

        try {
            // Sử dụng endpoint POST mới
            const response = await fetch(`${API_BASE_URL}/api/sessions/${eventid}`, {
                method: 'POST', 
                credentials: "include",
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`Đăng ký thất bại: ${errorBody.message || response.statusText}`);
            }

            alert(`✅ Đã ĐĂNG KÝ thành công buổi học có ID: ${eventid}`);
            // Tải lại toàn bộ danh sách để cập nhật trạng thái
            fetchSessions(); 

        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            alert(`❌ Đăng ký thất bại. Chi tiết: ${error.message}`);
        }
    };

    
    // --- Hàm chuyển trang ---
    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <p className="text-xl text-gray-600">Đang tải danh sách buổi học...</p>
        </div>
    );
    
    const hasResults = currentSessions.length > 0;

    return (
        <>
      {/* === THÊM NAVIGATION BAR Ở ĐÂY === */}
      {/* Prop identity cần được truyền từ state quản lý người dùng thực tế */}
      <NavigationBar/> 
            {/* FIX: Thêm padding-top (pt-20) cho div chính 
              để tránh nội dung bị che bởi NavigationBar cố định
            */}
            <div className="pt-20 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
                {/* Lệnh <script> đã được xóa vì đây là file JSX */}
      
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <script src="https://cdn.tailwindcss.com"></script>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                
                {/* Vùng Tìm kiếm và Lọc (BÊN TRÁI) */}
                <div className="lg:w-1/4 w-full flex-shrink-0">
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 lg:sticky lg:top-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tìm kiếm & Lọc</h2>
                        
                        {/* Tìm kiếm theo Tiêu đề/Người hướng dẫn */}
                        <label className="block text-sm font-medium mb-1 text-gray-700">Tiêu đề/Người hướng dẫn/Khoa:</label>
                        <input 
                            type="text" 
                            placeholder="Nhập từ khóa..." 
                            value={filterText}
                            onChange={(e) => {
                                setFilterText(e.target.value);
                                setCurrentPage(1); 
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4 transition duration-150"
                        />
                        
                        {/* Lọc theo Trạng thái */}
                        <label className="block text-sm font-medium mb-1 text-gray-700">Lọc theo Trạng thái:</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1); 
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-6 transition duration-150"
                        >
                            <option value="">Tất cả</option>
                            <option value="available">Sẵn sàng (Đăng ký)</option>
                            <option value="joined">Đã tham gia (Hủy)</option>
                            <option value="completed">Hoàn thành</option>
                        </select>

                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            Tìm thấy: {filteredSessions.length} buổi học.
                        </p>
                    </div>
                </div>

                {/* Vùng Hiển thị Danh sách Buổi học (BÊN PHẢI) */}
                <div className="lg:w-3/4 w-full">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Danh sách Buổi học
                    </h2>

                    <div className="course-cards-container grid md:grid-cols-2 gap-4">
                        {!hasResults ? (
                            <div className="p-6 text-center bg-white rounded-lg shadow-md text-gray-500 md:col-span-2">
                                Không tìm thấy buổi học nào phù hợp với bộ lọc.
                            </div>
                        ) : (
                            currentSessions.map((session) => (
                                <CourseCard 
                                    key={session.id || session.eventid} 
                                    session={session}
                                    onUnsubscribe={handleUnsubscribe} 
                                    onSubscribe={handleSubscribe} 
                                />
                            ))
                        )}
                    </div>
                    
                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-end items-center mt-6">
                            {/* Hiển thị tổng số trang */}
                            <p className="text-sm text-gray-600 mr-4 font-semibold">
                                Trang {currentPage} / {totalPages}
                            </p>
                            
                            <div className="pagination flex space-x-2">
                                {/* Nút Trước */}
                                <button 
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-blue-600 border border-blue-600 bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition duration-150"
                                >
                                    « Trước
                                </button>
                                {/* Nút Sau */}
                                <button 
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages}
                                    className="px-4 py-2 text-blue-600 border border-blue-600 bg-white rounded-lg hover:bg-blue-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau »
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
        </>
    );
};

export default App;