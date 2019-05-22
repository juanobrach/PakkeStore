import React, { Fragment } from 'react';
import { themeSettings, text } from '../../lib/settings';
import Item from './item';
import LoadMore from './loadMore';

const ProductList = ({
	products,
	addCartItem,
	settings,
	loadMoreProducts,
	hasMore,
	loadingProducts,
	loadingMoreProducts,
	isCentered,
	className = 'columns is-multiline is-mobile products',
	columnCountOnMobile,
	columnCountOnTablet,
	columnCountOnDesktop,
	columnCountOnWidescreen,
	columnCountOnFullhd,
	columnCount,
	is_pack
}) => {
	const items = products
		? products.map(product => (
				<Item
					key={product.id}
					product={product}
					addCartItem={addCartItem}
					settings={settings}
					columnCountOnMobile={columnCountOnMobile}
					columnCountOnTablet={columnCountOnTablet}
					columnCountOnDesktop={columnCountOnDesktop}
					columnCountOnWidescreen={columnCountOnWidescreen}
					columnCountOnFullhd={columnCountOnFullhd}
					columnCount={columnCount}
					is_pack={is_pack}
				/>
		  ))
		: null;

	return (
		<Fragment>
			<div
				className={
					className +
					(loadingProducts ? ' loading' : '') +
					(isCentered ? ' is-centered' : '')
				}
			>
				{items}
			</div>
			<div className="load-more">
				<LoadMore
					loadMoreProducts={loadMoreProducts}
					hasMore={hasMore}
					loading={loadingMoreProducts}
				/>
			</div>
		</Fragment>
	);
};

export default ProductList;
