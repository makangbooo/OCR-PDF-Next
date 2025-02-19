/*
  进入该组件时，通过路由传递path进来，形如：
    history.push({ pathname: '/pdfPreview', query: { path } })
*/
"use client"; // ✅ 关键一步，Next.js 需要明确它是 Client Component
import React, { useState } from 'react'
import { Spin, Tooltip, Input } from 'antd'
import {
	LeftOutlined,
	RightOutlined,
	PlusCircleOutlined,
	MinusCircleOutlined,
	FullscreenOutlined,
	FullscreenExitOutlined,
	ArrowLeftOutlined
} from '@ant-design/icons'
import styles from './index.less'

import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

import { history } from 'umi'

const PdfPreview: React.FC<{}> = (Props: any) => {
	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberInput, setPageNumberInput] = useState(1)
	const [pageNumberFocus, setPageNumberFocus] = useState(false)
	const [numPages, setNumPages] = useState(1)
	const [pageWidth, setPageWidth] = useState(600)
	const [fullscreen, setFullscreen] = useState(false)
	const { location } = history
	const { path }: any = location.query

	const onDocumentLoadSuccess = ({ numPages }: any) => {
		setNumPages(numPages)
	}
	const lastPage = () => {
		if (pageNumber == 1) return
		const page = pageNumber - 1
		setPageNumber(page)
		setPageNumberInput(page)
	}
	const nextPage = () => {
		if (pageNumber === numPages) return
		const page = pageNumber + 1
		setPageNumber(page)
		setPageNumberInput(page)
	}
	const onPageNumberFocus = (e: any) => {
		setPageNumberFocus(true)
	}
	const onPageNumberBlur = (e: any) => {
		setPageNumberFocus(false)
		setPageNumberInput(pageNumber)
	}
	const onPageNumberChange = (e: any) => {
		let value = e.target.value
		value = value <= 0 ? 1 : value
		value = value >= numPages ? numPages : value
		setPageNumberInput(value)
	}
	const toPage = (e: any) => {
		setPageNumber(Number(e.target.value))
	}
	const pageZoomOut = () => {
		if (pageWidth <= 600) return
		const width = pageWidth * 0.8
		setPageWidth(width)
	}
	const pageZoomIn = () => {
		const width = pageWidth * 1.2
		setPageWidth(width)
	}
	const pageFullscreen = () => {
		if (fullscreen) {
			setFullscreen(false)
			setPageWidth(600)
		} else {
			setFullscreen(true)
			setPageWidth(window.screen.width - 40)
		}
	}

	return (
		<div className={styles.view}>
			<ArrowLeftOutlined className={styles.back} onClick={() => history.goBack()} />
			<div className={styles.pageContainer}>
				<Document file={path} onLoadSuccess={onDocumentLoadSuccess} loading={<Spin size="large" />}>
					<Page pageNumber={pageNumber} width={pageWidth} loading={<Spin size="large" />} />
				</Document>
			</div>
			<div className={styles.pageTool}>
				<Tooltip title={pageNumber == 1 ? '已是第一页' : '上一页'}>
					<LeftOutlined className={styles.outlined} onClick={lastPage} />
				</Tooltip>
				<Input
					value={pageNumberFocus ? pageNumberInput : pageNumber}
					onFocus={onPageNumberFocus}
					onBlur={onPageNumberBlur}
					onChange={onPageNumberChange}
					onPressEnter={toPage}
					type="number"
				/>
				/ {numPages}
				<Tooltip title={pageNumber == numPages ? '已是最后一页' : '下一页'}>
					<RightOutlined className={styles.outlined} onClick={nextPage} />
				</Tooltip>
				<Tooltip title="放大">
					<PlusCircleOutlined className={styles.outlined} onClick={pageZoomIn} />
				</Tooltip>
				<Tooltip title="缩小">
					<MinusCircleOutlined className={styles.outlined} onClick={pageZoomOut} />
				</Tooltip>
				<Tooltip title={fullscreen ? '恢复默认' : '适合窗口'}>
					{fullscreen ? (
						<FullscreenExitOutlined className={styles.outlined} onClick={pageFullscreen} />
					) : (
						<FullscreenOutlined className={styles.outlined} onClick={pageFullscreen} />
					)}
				</Tooltip>
			</div>
		</div>
	)
}

export default PdfPreview