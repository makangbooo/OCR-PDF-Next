"use client";
import React from 'react';
import { useState } from "react";
import axios from "axios";
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {Button, Divider, Image, Space, Upload} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});



const UploadViewer: React.FC<{ refreshPdfUrl: (url:string, imageUrlList: string[]) => void }>= ({refreshPdfUrl} ) => {


	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as FileType);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		setFileList(newFileList);
		console.log(newFileList);
	}

	const onClear = () => {
		setFileList([]);
	}
	const onConvert = async () => {
		const formData = new FormData();
		fileList.forEach(file => {
			formData.append('file', file.originFileObj as FileType);
		})
		try {

			const response = await axios.post("http://localhost:8080/OCRToPDF/imageToPDF", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				responseType: "json",  // 修改为 'blob' 如果是下载PDF文件
			});
			console.log("response", response);
			const pdfUrl = response.data.path;




			//遍历fileList数组，获取每个对象中的response属性，赋值给imageUrlList数组
			const imageUrlList = fileList.map((file) => file.response);
			refreshPdfUrl(pdfUrl,imageUrlList);
		} catch (error) {
			console.error("上传失败:", error);
		}



	}


	const uploadButton = (
		<button style={{ border: 0, background: 'none' }} type="button">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>点击上传</div>
		</button>
	);
	return(
	<>
		<Space>
			<Button onClick={onClear}>一键清空</Button>
			<Button type="primary" onClick={onConvert}>
				开始转换
			</Button>
		</Space>
		<Divider />
		<Upload
			action="http://localhost:8080/OCRToPDF/uploadImage"
			listType="picture-card"
			fileList={fileList}
			onPreview={handlePreview}
			onChange={handleChange}
		>
			{fileList.length >= 8 ? null : uploadButton}
		</Upload>
		{previewImage && (

			<Image
				wrapperStyle={{ display: 'none' }}
				preview={{
					visible: previewOpen,
					onVisibleChange: (visible) => setPreviewOpen(visible),
					afterOpenChange: (visible) => !visible && setPreviewImage(''),
				}}
				src={previewImage}
			/>
		)}

	</>
	)
}
export default UploadViewer;