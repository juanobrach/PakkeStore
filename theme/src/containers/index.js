import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { themeSettings } from '../lib/settings';
import MetaTags from '../components/metaTags';
import CustomProducts from '../components/products/custom';
import HomeSlider from '../components/homeSlider';

const IndexContainer = props => {
	const {
		addCartItem,
		state: { pageDetails, settings, categories }
	} = props;

	const slider_pictures = [
		{
			image: '/assets/images/slider/slider_1.png',
			title: '',
			description: '',
			path: '/assets/images/slider/slider_1.png',
			button: ''
		},
		{
			image: '/assets/images/slider/slider_1.png',
			title: '',
			description: '',
			path: '/assets/images/slider/slider_1.png',
			button: ''
		}

	]; 

	return (
		<Fragment>
			<MetaTags
				title={pageDetails.meta_title}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={pageDetails.meta_title}
				ogDescription={pageDetails.meta_description}
			/>

			<HomeSlider images={slider_pictures} />

			{pageDetails.content &&
				pageDetails.content.length > 10 && (
					<section className="section">
						<div className="container">
							<div className="content">
								<div
									dangerouslySetInnerHTML={{
										__html: pageDetails.content
									}}
								/>
							</div>
						</div>
					</section>
				)}

			<section className="section">
				<div className="container">
					<section >
						<div className="title is-4">
						 	Categorías
						</div>
						<div className="columns has-text-centered categories-links">
						 {
						 	categories.map( (category, key )=>{
						 		if( category.parent_id != null ) return false;
						 		return <div className="column" key={key}>
						 			<a href={ category.path } >
							 			<div>
							 				<img src="/assets/images/icons/category-icon.png" />
							 			</div>
							 			<h3>{ category.name }</h3>
						 			</a>
						 		</div>
						 	})
						 }
						</div>
					</section>
					<section style={{ marginTop:'25px'}}>
						<div className="title is-4">
							Productos destacados
						</div>
						<CustomProducts
							sku={themeSettings.home_products_sku}
							sort={themeSettings.home_products_sort}
							limit={themeSettings.home_products_limit}
							settings={settings}
							addCartItem={addCartItem}
						/>
					</section>
				</div>
			</section>
		</Fragment>
	);
};

IndexContainer.propTypes = {
	addCartItem: PropTypes.func.isRequired,
	state: PropTypes.shape({
		settings: PropTypes.shape({}),
		pageDetails: PropTypes.shape({})
	}).isRequired
};

export default IndexContainer;
