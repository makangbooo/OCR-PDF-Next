"use client";
import React from 'react';
import { message, Upload, type UploadProps} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

const {Dragger} = Upload;

const props: UploadProps = {
	name: 'file',
	multiple: true,
	action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',

	onChange(info) {
		const {status} = info.file;
		if (status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	},
	onDrop(e) {
		console.log('Dropped files', e.dataTransfer.files);
	},
};

// 渐变色按钮
const UploadViewer: React.FC<{ refreshPdfUrl: () => void }>= ({refreshPdfUrl} ) => {
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!file) {
			alert("请选择图片文件！");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post("http://localhost:8080/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				responseType: "blob", // 期待后端返回 PDF 文件
			});

			// 将 Blob 转换成可预览的 PDF 链接
			const pdfBlob = new Blob([response.data], { type: "application/pdf" });
			const pdfUrl = URL.createObjectURL(pdfBlob);
			refreshPdfUrl(pdfUrl);
			console.log("UploadViewer:",pdfUrl);
		} catch (error) {
			console.error("上传失败:", error);
		}
	};

	return(
	<>
		{/*拖拽上传框*/}
		<Dragger {...props}>
			<p className="ant-upload-drag-icon">
				<InboxOutlined/>
			</p>
			<p className="ant-upload-text">Click or drag file to this area to upload</p>
			<p className="ant-upload-hint">
				Support for a single or bulk upload. Strictly prohibited from uploading company data or other
				banned files.
			</p>
		</Dragger>
		<input type="file" accept="image/*" onChange={handleFileChange} />
		<button onClick={handleUpload} className="mt-2 p-2 bg-blue-500 text-white rounded">
			上传图片
		</button>
	</>
	)
}
export default UploadViewer;