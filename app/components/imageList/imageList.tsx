import React from 'react';
import { Divider,Image } from 'antd';
interface ImageListProps {
	imageUrlList: string[]; // 图片 URL 列表
}

const ImageList: React.FC<ImageListProps> = ({ imageUrlList }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
			{imageUrlList.map((url, index) => (
				<>
					<Image
						width={'100%'}
						src={url}
						key={index}
						alt={`image-${index}`}
				/>
				<Divider />
				</>
			))}
		</div>
	);
};

export default ImageList;