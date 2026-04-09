import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Collapse,
  Link,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// --- MOCKING/PLACEHOLDER ---
import { API_URL } from "../services/api.js";
import NavigationBar from "../components/NavigationBar.jsx";
// --- END MOCKING ---

// Ánh xạ tab UI → key trong dữ liệu API
const TAB_KEY_MAPPING = {
  "Lý thuyết": "Sách & Giáo trình",
  "Bài tập": "Bài tập",
};

export default function SubjectMaterialPage() {
  const [searchParams] = useSearchParams();
  const subjectId = useMemo(() => searchParams.get("subjectid")?.trim() || "", [searchParams]);

  const [tab, setTab] = useState("Lý thuyết");
  const [materials, setMaterials] = useState({
    "Sách & Giáo trình": [],
    "Bài tập": [],
  });
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandAll, setExpandAll] = useState(false); // Trạng thái mở rộng tất cả liên kết

  useEffect(() => {
    if (!subjectId) {
      setSubjectName("Mã môn học không hợp lệ");
      setLoading(false);
      return;
    }

    const fetchMaterialData = async () => {
      setLoading(true);
      try {
        // 1. Lấy tên môn học
        let response = await fetch(`${API_URL}/subject/${subjectId}`);
        let data = await response.json();
        setSubjectName(data.subject_name || "Môn học");

        // 2. Lấy tài liệu (dữ liệu có cấu trúc như bạn cung cấp)
        response = await fetch(`${API_URL}/materials/${subjectId}`);
        data = await response.json();

        // data sẽ là: { "Sách & Giáo trình": [...], "Bài tập": [...] }
        setMaterials(data);
      } catch (error) {
        console.error("Lỗi khi tải tài liệu:", error);
        setSubjectName("Lỗi tải dữ liệu");
        setMaterials({ "Sách & Giáo trình": [], "Bài tập": [] });
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialData();
  }, [subjectId]);

  // Lấy danh sách hiện tại theo tab đang chọn
  const apiKey = TAB_KEY_MAPPING[tab];
  const currentList = materials[apiKey] || [];

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: "#f5f5f5", overflowX: "hidden" }}>
      <NavigationBar />

      <Box sx={{ maxWidth: "lg", mx: "auto", mt: 4, px: { xs: 2, sm: 4 }, pb: 8 }}>
        <Typography variant="h4" sx={{ color: "#0099ff", fontWeight: 600, mb: 4 }}>
          Tài liệu {subjectName} ({subjectId})
        </Typography>

        {/* Tabs */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          {["Lý thuyết", "Bài tập"].map((t) => (
            <Button
              key={t}
              onClick={() => {
                setTab(t);
                setExpandAll(false); // Đóng mở rộng khi đổi tab
              }}
              sx={{
                bgcolor: tab === t ? "#0099ff" : "#f0f0f0",
                color: tab === t ? "white" : "#555",
                borderRadius: 2,
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: tab === t ? "#007acc" : "#e0e0e0" },
              }}
            >
              {t}
            </Button>
          ))}
        </Box>

        {/* Nút Mở rộng / Thu gọn tất cả liên kết */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            onClick={() => setExpandAll(!expandAll)}
            startIcon={expandAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              color: "#0099ff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(0, 153, 255, 0.04)" },
            }}
          >
            {expandAll ? "Thu gọn" : "Mở rộng"} tất cả liên kết
          </Button>
        </Box>

        {/* Danh sách tài liệu */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress color="primary" />
            <Typography sx={{ ml: 2, color: "#555" }}>Đang tải tài liệu...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {currentList.length > 0 ? (
              currentList.map((item, idx) => (
                <Box key={idx}>
                  {/* Tiêu đề tài liệu - click để mở file ngay */}
                  <Box
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      p: "14px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#0099ff",
                        boxShadow: "0 4px 12px rgba(0, 153, 255, 0.1)",
                      },
                    }}
                    onClick={() => window.open(item.file_url, "_blank")}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 18, color: "#0099ff" }} />
                    <Typography sx={{ fontSize: "1.1rem", color: "#333", fontWeight: 500 }}>
                      {item.title}
                    </Typography>
                  </Box>

                  {/* Đường dẫn chi tiết (hiển thị khi mở rộng) */}
                  <Collapse in={expandAll}>
                    <Box
                      sx={{
                        pl: 6,
                        py: 2,
                        bgcolor: "#fafafa",
                        borderRadius: "0 0 8px 8px",
                        border: "1px dashed #ddd",
                        borderTop: "none",
                        mt: -1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Đường dẫn:
                      </Typography>
                      <Link
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ wordBreak: "break-all", fontSize: "0.95rem", color: "#0099ff" }}
                      >
                        {item.file_url}
                      </Link>
                    </Box>
                  </Collapse>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  bgcolor: "white",
                  p: 6,
                  borderRadius: 2,
                  textAlign: "center",
                  border: "1px dashed #ddd",
                }}
              >
                <Typography color="text.secondary" variant="h6">
                  Chưa có tài liệu nào trong mục {tab} này.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}