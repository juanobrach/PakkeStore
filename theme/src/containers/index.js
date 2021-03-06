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
			image: '/assets/images/slider/slider_1.jpg',
			title: '',
			description: '',
			path: '/assets/images/slider/slider_1.jpg',
			button: ''
		},
		{
			image: '/assets/images/slider/slider_2.jpg',
			title: '',
			description: '',
			path: '/assets/images/slider/slider_2.jpg',
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
					<section>
						<div className="container is-widescreen">
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

			<section className="section" style={{paddingTop:'40px'}}>
				<div className="container is-widescreen">
					<section style={{paddingTop:'30px'}} >
						<div className="title is-4">
						 	Categorías
						</div>
						<div className="columns has-text-centered  categories-links is-gapless">
						 {
						 	categories.map( (category, key )=>{
								 console.log( category );

								let imagePath = ( !!category.image ?  category.image : "/assets/images/icons/category-icon.png" )

						 		if( category.parent_id != null ) return false;
						 		return <div className="column" key={key}>
						 			<div>
							 			<a href={ category.path } className="block" >
								 				<img src={imagePath} style={{maxWidth:'90px'}} />
							 			</a>
						 			</div>
						 		</div>
						 	})
						 }
						</div>
					</section>
					<section style={{ marginTop:'30px'}}>
						<div className="title is-4">
							Productos destacados
						</div>
						<CustomProducts
							sku={themeSettings.home_products_sku}
							sort={themeSettings.home_products_sort}
							limit={4}
							settings={settings}
							addCartItem={addCartItem}
							columnCount={12}
						/>
					</section>
					<section style={{ marginTop:'30px'}}>
						<div className="title is-4">
							Paquete de cajas
						</div>
						<CustomProducts
							is_pack={true}
							sort={themeSettings.home_products_sort}
							limit={2}
							settings={settings}
							addCartItem={addCartItem}
							columnCount={12}
						/>
					</section>
					<section style={{ marginTop:'30px'}}>
						<div className="title is-4">
							Te puede interesar
						</div>
						<CustomProducts
							sku={themeSettings.home_products_sku}
							sort={themeSettings.home_products_sort}
							limit={4}
							settings={settings}
							addCartItem={addCartItem}
							columnCount={12}
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
