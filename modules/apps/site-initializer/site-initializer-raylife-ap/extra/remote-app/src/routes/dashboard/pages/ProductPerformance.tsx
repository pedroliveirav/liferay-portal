/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayChart from '@clayui/charts';
import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {useEffect, useState} from 'react';

import Header from '../../../common/components/header';
import ProductList, {
	ProductCell,
} from '../../../common/components/product-list';

const PRODUCT_SALES_GOAL = [
	{
		active: false,
		productName: 'Auto',
		salesGoal: 102000,
		totalSales: 120000,
	},
	{
		active: false,
		productName: 'Business Owner Policy',
		salesGoal: 102000,
		totalSales: 90000,
	},
	{
		active: false,
		productName: 'General Liability',
		salesGoal: 102000,
		totalSales: 10000,
	},
	{
		active: false,
		productName: 'Professional Liability',
		salesGoal: 102000,
		totalSales: 150000,
	},
	{
		active: false,
		productName: 'Workers Compensation',
		salesGoal: 102000,
		totalSales: 60000,
	},
];

const TIME_PERIODS = ['YTD', '3 MO', '6 MO'];

type BarChartPerformanceTypes = {
    colors: string[],
	dataColumns: string[],
    groups: string[],
	height: number,
	labelColumns: string[],
	showLegend: boolean,
	showTooltip: boolean,
	titleTotal: boolean,
	totalSum: number,
	width: number,
}



const dataColumn: any = {
	
	three: {
	
		1:{
			achieved: 300,
			exceeded: 0,
			goals: 100,
			},
		2:
		{
			achieved: 350,
			exceeded: 0,
			goals: 200,
				},
		3:
		{
			achieved: 400,
			exceeded: 0,
			goals: 200,
			
		},
	},
	yearly: {
	
	0:{
		achieved: 300,
		exceeded: 0,
		goals: 100,
		},
	1:
	{
		achieved: 350,
		exceeded: 0,
		goals: 200,
			},
	2:
	{
		achieved: 400,
		exceeded: 0,
		goals: 200,
		
	},
	3:{
		achieved: 30,
		exceeded: 0,
		goals: 200,
			},
	4:{
		achieved: 300,
		exceeded: 300,
		goals: 40,
			},
	5:
	{
		achieved: 30,
		exceeded: 0,
		goals: 200,
			},
	6:
	{
		achieved: 30,
		exceeded: 0,
		goals: 200,
			},
	7:{
		achieved: 30,
		exceeded: 0,
		goals: 200,
			},

	// 8:{
	// 	achieved: 30,
	// 	exceeded: 0,
	// 	goals: 200,
	// 		},
	// 9:
	// {
	// 	achieved: 30,
	// 	exceeded: 0,
	// 	goals: 200,
		
	// },
	// 10:
	// {
	// 	achieved: 30,
	// 	exceeded: 0,
	// 	goals: 200,
		
	// },
	// 11:
	// {
	// 	achieved: 30,
	// 	exceeded: 0,
	// 	goals: 200,
	// },
	
	
	},


	
}

const colors: {[keys:string]:{}} = {
	achieved: '#55C2FF',
	exceeded: '#FFD76E',
	goals:'#DCF1FD'
}

const achieved = Object.values(dataColumn.yearly).map((item: any) => item.achieved > item.goals ? item.goals: item.achieved)

const exceeded = Object.values(dataColumn.yearly).map((item: any) => item.achieved > item.goals ? item.achieved - item.goals : NaN)

const goals = Object.values(dataColumn.yearly).map((item:any) => item.goals < 0 || item.goals < item.achieved ? NaN : item.goals)


const dataChart: any = {

	data:{

		columns: 
			
		[
			['achieved', ...achieved],
			['exceeded', ...exceeded],
			['goals', ...goals]
		]
		,
		groups: [
			['achieved','exceeded'], [ 'achieved', 'goals',]
		],

		
	}
}

const labelColumns = [
	'Jan 2022',
	'Feb 2022',
	'Mar 2022',
	'Apr 2022',
	'May 2022',
	'Jun 2022',
	'Jul 2022',
	'Ago 2022',
	'Sep 2022',
	'Oct 2022',
	'Nov 2022',
	'Dec 2022',
];


const BarChartPerformancee: BarChartPerformanceTypes  = {
    colors:[],
	dataColumns:[],
    groups : [''],
	height : 338,
	labelColumns:[],
	showLegend : false,
	showTooltip : true,
	titleTotal : true,
	totalSum : 0,
	width : 700,
}


const ProductPerformance = () => {
	const [products, setProducts] = useState<ProductCell[]>([]);
	const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[0]);

	useEffect(() => {
		setProducts(PRODUCT_SALES_GOAL);
	}, []);

	const isFilterAllActive = (product: ProductCell) => !product.active;
	const findActiveProduct = products.find((product) => product.active)
		?.productName;

	const handleProductFilterToggle = (productName: string) => {
		const newProducts = products.map((product) => {
			product.productName === productName
				? (product.active = true)
				: (product.active = false);

			return product;
		});

		setProducts(newProducts);
	};

	return (
		<div className="d-flex flex-wrap ray-dashboard-product-performance">
			<div className="col-md-5 left-container px-0">
				<Header
					className="header-row px-4 py-3"
					title="Product Performance"
				/>

				<ProductList
					onSelect={handleProductFilterToggle}
					productList={products}
				/>
			</div>

			<div className="col-md-7 px-0 right-container">
				<div className="align-items-center d-flex header-row justify-content-between px-4 py-3">
					<p className="m-0 text-paragraph">
						<ClayButton
							className={classNames('general-filter mr-1', {
								'disabled font-weight-bolder': products.every(
									isFilterAllActive
								),
							})}
							displayType="unstyled"
							onClick={() => {
								if (!products.every(isFilterAllActive)) {
									handleProductFilterToggle('All');
								}
							}}
						>
							All
						</ClayButton>

						{!products.every(isFilterAllActive) && (
							<>
								<ClayIcon
									className="mr-1"
									symbol="angle-right-small"
								/>

								<span className="font-weight-bolder">{`${findActiveProduct}`}</span>
							</>
						)}
					</p>

					<ClaySelect
						className="product-performance-select"
						onChange={({target}) => {
							setTimePeriod(target.value);
						}}
						sizing="sm"
						value={timePeriod}
					>
						{TIME_PERIODS.map((timePeriod, index) => (
							<ClaySelect.Option
								key={index}
								label={timePeriod}
								value={timePeriod}
							/>
						))}
					</ClaySelect>
				</div>

				<div className="overflow-auto p-5" > 

				<ClayChart
					
				axis={{
					x: {
						categories: [...labelColumns],
						height: 50,
						position:{x: 30},
						show: true,
						type: 'category',
						width:100,
										
					},
					y: {
						fixed: true,
						show: true,
						tick: {
							format(x:any) {return '$' + x},
							stepSize: 50,
							}
					},
				}}
				bar={{
					radius: {
						ratio: 0.2,
					},
					width: {
						data: 20,
					},
				}}
				data={{
					colors,
					columns:dataChart.data.columns,
                    groups: dataChart.data.groups,					
					order: { function ()  {Object.values(dataColumn.yearly).map((item: any) => item.achieved > item.goals ? 'asc' : 'desc ')}},
					type: 'bar',
				}}

				grid={{
					x: {
						show: true,
						}
					}}
				
				legend={{
					item: {
						onclick: () => {return false},
						onout: () =>  {return false},
						onover: () =>  {return false},
					},
					show: false,
				}}
				size={{
					height: BarChartPerformancee.height,
					width: BarChartPerformancee.width
				}}
				tooltip={{
					show: true,
				}}
				/>	
					
					<div className='legend'>
						<div className="legend-goals">
							<div className="square-goals"></div>

							<h6>Goals</h6>
						</div>

						<div className="legend-achieved">
							<div className="square-ach"></div>

							<h6>Achieved</h6>
						</div>
						
						<div className="legend-exceeded">
							<div className="square-exc"></div>

							<h6>Exceeded</h6>
						</div>
					</div>
					</div>
				</div>
			</div>
	);
};

export default ProductPerformance;
