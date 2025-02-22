import React, {useState, useRef, useEffect} from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import html2canvas from "html2canvas";
import axios from "axios";
import {Flex, Typography} from "antd";

const PdfViewer = ({ file }) => {
	const [numPages, setNumPages] = useState(null);

	const onLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};
	console.log("PdfViewer.file",file)

	const [isDrawing, setIsDrawing] = useState(false); // 是否正在画矩形
	const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // 矩形起点
	const [rect, setRect] = useState(null); // 矩形位置和尺寸，初始为 null
	const containerRef = useRef(null); // 用于绑定容器
	const [ocrResult, setOcrResult] = useState(""); // 保存 OCR 结果

	// 开始绘制
	const handleMouseDown = (e) => {
		const rectContainer = containerRef.current.getBoundingClientRect();
		const x = e.clientX - rectContainer.left;
		const y = e.clientY - rectContainer.top;
		setStartPos({ x, y });
		// 开始新绘制时清除上一次的矩形
		setRect({ x, y, width: 0, height: 0 });
		setIsDrawing(true);
	};

	// 动态更新矩形
	const handleMouseMove = (e) => {
		if (!isDrawing) return;

		const rectContainer = containerRef.current.getBoundingClientRect();
		const currentX = e.clientX - rectContainer.left;
		const currentY = e.clientY - rectContainer.top;

		const width = currentX - startPos.x;
		const height = currentY - startPos.y;

		setRect({
			x: width < 0 ? currentX : startPos.x, // 处理反向拖动
			y: height < 0 ? currentY : startPos.y,
			width: Math.abs(width),
			height: Math.abs(height),
		});
	};

	// 结束绘制但保留矩形
	const handleMouseUp = async () => {
		if (!isDrawing || !rect) return;
		setIsDrawing(false);

		try {
			const canvas = await html2canvas(containerRef.current, {
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height,
				scale: 2,
			});
			const imgData = canvas.toDataURL("image/png");

			// 将 Base64 转为 Blob
			const blob = await (await fetch(imgData)).blob();
			const formData = new FormData();
			formData.append("file", blob, "screenshot.png"); // "file" 与后端参数名一致

			// 发送到后端
			const response = await axios.post("http://localhost:8080/OCRToPDF/ocrImage", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			setOcrResult(response.data || "未识别到文字");
		} catch (error) {
			console.error("OCR 处理失败:", error);
			setOcrResult("OCR 处理失败");
		}
	};

	const [containerWidth, setContainerWidth] = useState(0); // 存储div的宽度
	// 当容器宽度变化时更新state
	useEffect(() => {
		// 初始获取容器宽度
		if (containerRef.current) {
			setContainerWidth(containerRef.current.offsetWidth);
		}

		// 添加resize监听器来响应容器宽度变化
		const resizeListener = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.offsetWidth);
			}
		};

		window.addEventListener('resize', resizeListener);

		// 清理监听器
		return () => {
			window.removeEventListener('resize', resizeListener);
		};
	}, []); // 只在组件挂载时设置监听器



	return (
		<>
		{
			file ?
				<div
					ref={containerRef}
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						backgroundColor: "#f0f0f0",
						overflow: "hidden",
						userSelect: "none", // 防止拖动时选中文字
					}}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
				>

						<Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`}>
							<Viewer fileUrl={file} onLoadSuccess={onLoadSuccess} width={containerWidth}/>
						</Worker>
						<div>
							{numPages && (
								<p>PDF 页数: {numPages}</p>
							)}
						</div>
						{/* 动态绘制的矩形 */}
						{/* 显示矩形轮廓 */}
						{rect && (
							<div
								style={{
									position: "absolute",
									left: `${rect.x}px`,
									top: `${rect.y}px`,
									width: `${rect.width}px`,
									height: `${rect.height}px`,
									border: "2px dashed red",
									backgroundColor: "rgba(255, 0, 0, 0.1)", // 半透明填充
									pointerEvents: "none", // 防止矩形干扰鼠标事件
								}}
							/>
						)}
						<div
							style={{
								position: "absolute",
								bottom: "20px",
								left: "20px",
								backgroundColor: "white",
								padding: "10px",
								border: "1px solid #ccc",
							}}
						>
							<h3>OCR 结果:</h3>
							<p>{ocrResult || "等待识别..."}</p>
						</div>

				</div>
				:
				<Flex justify="center" align="center" style={{ height: '100%',width:"100%" }}>
					<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
						pdf文件
					</Typography.Title>
				</Flex>
		}
		</>

	);
};

export default PdfViewer;