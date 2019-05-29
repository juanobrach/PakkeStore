import React from 'react';
import PropTypes from 'prop-types';
import { themeSettings, text } from '../lib/settings';

const Sort = ({ defaultSort, currentSort, setSort, changeLayout }) => (
	<div className="is-mobile sort">
		<div className="column is-12 sort-title">
			<h4>{text.sort}</h4>
		</div>
		<div className="column is-8 is-paddingless">
			<div className="level" >
				<div className="level-item">
					<span className="select is-fullwidth">
						<select
							onChange={e => {
								setSort(e.target.value)
							}}
							value={currentSort}
							style={{padding:'0'}}
						>
							<option value="name">{text.sortAlphabet}</option>
							<option value={defaultSort}>{text.sortFavorite}</option>
							<option value={themeSettings.sortNewest}>{text.sortNewest}</option>
							<option value={"price"}>
								{text.sortPriceLow}
							</option>
							<option value={"-price"}>
								{text.sortPriceHigh}
							</option>
						</select>
					</span>
				</div>
				<div className="level-item">
				<div>
					<img onClick={ ()=> {changeLayout('grid')} } src="/assets/images/icons/grid_icon.png" alt="" style={{ cursor:'pointer', marginRight:'12px'}}/>
					<img onClick={ ()=> {changeLayout('list')} } src="/assets/images/icons/list-icon.png" alt="" style={{cursor:'pointer'}} />
				</div>
				</div>
			</div>
		</div>
	</div>
);

Sort.propTypes = {
	defaultSort: PropTypes.string.isRequired,
	currentSort: PropTypes.string.isRequired,
	setSort: PropTypes.func.isRequired
};

export default Sort;
