/* eslint-disable no-console */
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

import 'clay-charts-react/lib/css/main.css';
import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';

import Header from '../../../common/components/header';
import ProductList, {
	ProductCell,
} from '../../../common/components/product-list';
import {getPoliciesForSalesGoal, getSalesGoal} from '../../../common/services';
import {
	currentDateString,
	december,
	january,
	sixMonthsAgoDate,
	threeMonthsAgoDate,
} from '../../../common/utils/dateFormatter';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import {
	BarChartPerformanceTypes,
	Policy,
	ProductListType,
	SalesGoal,
} from './ProductPerfomanceTypes';
import {annualRule, sixMonthRule, threeMonthRule} from './businessRules';
import {populateDataByPeriod} from './filterPeriodRules';

const BarChartPerformancee: BarChartPerformanceTypes = {
	colors: [],
	dataColumns: [],
	groups: [''],
	height: 400,
	labelColumns: [],
	showLegend: false,
	showTooltip: true,
	titleTotal: true,
	totalSum: 0,
	width: 600,
};

const TIME_PERIODS = [
	{
		label: '3 MO',
		value: '2',
	},
	{
		label: '6 MO',
		value: '1',
	},
	{
		label: 'YTD',
		value: '0',
	},
];

const colors: {[keys: string]: {}} = {
	achieved: '#55C2FF',
	exceeded: '#FFD76E',
	goals: '#DCF1FD',
};

// const paddingValue = 100;

let widthValue = 20;

const ProductPerformance = () => {
	const [products, setProducts] = useState<ProductCell[]>([]);
	const [timePeriod, setTimePeriod] = useState('0');
	const labelRef = useRef<any>();
	const [isLoading, setIsLoading] = useState(false);
	const [threeMonthsSalesData, setThreeMonthsSalesData] = useState<string[]>(
		[]
	);
	const [threeMonthsGoalsData, setThreeMonthsGoalsData] = useState<string[]>(
		[]
	);
	const [sixMonthsSalesData, setSixMonthsSalesData] = useState<string[]>([]);
	const [sixMonthsGoalsData, setSixMonthsGoalsData] = useState<string[]>([]);
	const [yearToDateSales, setYearToDateSales] = useState<string[]>([]);
	const [yearToDateGoals, setYearToDateGoals] = useState<string[]>([]);
	const [currentTooltip, setCurrentTooltip] = useState<string[]>(
		yearToDateGoals
	);
	const [productValues, setProductsValues] = useState('All');
	const windowSize = useWindowDimensions(); // alterar

	const [paddingValue, setPaddingValue] = useState(100);

	// let categoryLabelTooltip = '';

	const {deviceSize, width} = useWindowDimensions();

	useEffect(() => {
		console.log('deviceSize', deviceSize);
		console.log('width', width);

		if (labelRef.current) {
			const chartContainer = document.getElementById('chart-container-1');

			if (chartContainer) {
				const styles = getComputedStyle(chartContainer);
				const chartContainerWidth = Number(
					styles.width.replace('px', '')
				);

				const calculatedWidth = chartContainerWidth - 10;

				// const calculatedWidth = chartContainerWidth - 10;

				setPaddingValue(paddingValue - 10);
				console.log(
					'awaw',
					BarChartPerformancee.width,
					chartContainerWidth,
					calculatedWidth
				);

				labelRef.current.resize({
					height: 440,
					width: calculatedWidth,
				});
			}
		}

		console.log('ref', labelRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [width]);

	useEffect(() => {}, [timePeriod]);

	const tooltip = {
		format: {
			name(categoryLabel: string) {
				return categoryLabel;
			},
			value(value: any, _id: number, index: string, x: number) {
				if (value !== 0) {
					if (index === 'goals') {
						const tooltipGoals = (value = currentTooltip[x]);

						return tooltipGoals;
					} else {
						return value;
					}
				}
			},
		},
		grouped: false,
		show: true,
	};

	function getExceededValues(goalValue: any, salesValue: any) {
		const exceededValue = goalValue?.map((goal: number, index: number) => {
			if (goal - salesValue[index] <= 0) {
				return (goal - salesValue[index]) * -1;
			} else {
				return 0;
			}
		});

		return exceededValue;
	}

	function getGoalsValues(goalValue: any, salesValue: any) {
		const goalsValues = goalValue?.map((goal: number, index: number) => {
			if (goal - salesValue[index] >= 0) {
				return goal - salesValue[index];
			} else {
				return 0;
			}
		});

		return goalsValues;
	}

	function getAchievedValues(goalValue: any, salesValue: any) {
		const achievedValues = goalValue?.map((goal: number, index: number) => {
			if (goal - salesValue[index] <= 0) {
				return goal;
			} else {
				return salesValue[index];
			}
		});

		return achievedValues;
	}

	const threeMonthsSalesArray: string[] = [];
	const threeMonthsGoalsArray: string[] = [];
	const sixMonthsSalesArray: string[] = [];
	const sixMonthsGoalsArray: string[] = [];
	const yearToDateSalesArray: string[] = [];
	const yearToDateGoalsArray: string[] = [];
	const threeMonthsLabel: string[] = [];
	const sixMonthsLabel: string[] = [];
	const yearToDateLabel: string[] = [];
	const threeMonthsDatePeriod = 2;
	const sixMonthsDatePeriod = 5;
	const indexOfCurrentMonth = new Date().getMonth();

	populateDataByPeriod(
		threeMonthsDatePeriod,
		threeMonthsLabel,
		threeMonthsSalesArray,
		threeMonthsGoalsArray
	);

	populateDataByPeriod(
		sixMonthsDatePeriod,
		sixMonthsLabel,
		sixMonthsSalesArray,
		sixMonthsGoalsArray
	);

	populateDataByPeriod(
		indexOfCurrentMonth,
		yearToDateLabel,
		yearToDateSalesArray,
		yearToDateGoalsArray
	);

	const loadData = [
		{
			achieved: [
				'achieved',
				...getAchievedValues(
					threeMonthsGoalsData,
					threeMonthsSalesData
				),
			],
			dataGroups: ['achieved', 'exceeded', 'goals'],
			exceeded: [
				'exceeded',
				...getExceededValues(
					threeMonthsGoalsData,
					threeMonthsSalesData
				),
			],
			goals: [
				'goals',
				...getGoalsValues(threeMonthsGoalsData, threeMonthsSalesData),
			],
			label: threeMonthsLabel,
			period: 2,
			periodDate: 'Period',
		},
		{
			achieved: [
				'achieved',
				...getAchievedValues(sixMonthsGoalsData, sixMonthsSalesData),
			],
			dataGroups: ['achieved', 'exceeded', 'goals'],
			exceeded: [
				'exceeded',
				...getExceededValues(sixMonthsGoalsData, sixMonthsSalesData),
			],
			goals: [
				'goals',
				...getGoalsValues(sixMonthsGoalsData, sixMonthsSalesData),
			],
			label: sixMonthsLabel,
			period: 1,
			periodDate: 'Period',
		},
		{
			achieved: [
				'achieved',
				...getAchievedValues(yearToDateGoals, yearToDateSales),
			],
			dataGroups: ['achieved', 'exceeded', 'goals'],
			exceeded: [
				'exceeded',
				...getExceededValues(yearToDateGoals, yearToDateSales),
			],
			goals: [
				'goals',
				...getGoalsValues(yearToDateGoals, yearToDateSales),
			],
			label: yearToDateLabel,
			period: 0,
			periodDate: 'Period',
		},
	];

	const getData = () => {
		return loadData?.filter((data) => data.period === Number(timePeriod));
	};

	const lengthExceededColumn = getData()[0]?.exceeded.length - 1;

	const dataChart = {
		colors,
		columns: [
			getData()[0]?.achieved,
			getData()[0]?.goals,
			getData()[0]?.exceeded,
		],
		groups: [['achieved', 'exceeded', 'goals']],
		order: {
			function() {
				loadData?.map((month: any) =>
					month.achieved > month.goals ? 'asc' : 'desc '
				);
			},
		},
		type: 'bar',
	};

	const productsBaseSetup = async () => {
		const yearlyPolicies = await getPoliciesForSalesGoal(
			currentDateString[0],
			currentDateString[1],
			currentDateString[0],
			january
		);

		const yearlySalesGoal = await getSalesGoal(
			currentDateString[0],
			december,
			currentDateString[0],
			january
		);

		const newProductList: ProductCell[] = [];
		const yearlyProductsTotal: ProductListType = {};

		yearlyPolicies?.data?.items?.forEach(
			({
				productExternalReferenceCode,
				productName,
				termPremium,
			}: Policy) => {
				if (!yearlyProductsTotal[productExternalReferenceCode]) {
					yearlyProductsTotal[productExternalReferenceCode] = {
						goalValue: 0,
						productName,
						totalSales: termPremium,
					};

					return;
				}

				yearlyProductsTotal[productExternalReferenceCode][
					'totalSales'
				] += termPremium;
			}
		);

		yearlySalesGoal?.data?.items?.forEach(
			({goalValue, productExternalReferenceCode}: SalesGoal) => {
				yearlyProductsTotal[productExternalReferenceCode][
					'goalValue'
				] += goalValue;
			}
		);

		Object.keys(yearlyProductsTotal).forEach(
			(productExternalReferenceCode: string) => {
				newProductList.push({
					active: false,
					goalValue:
						yearlyProductsTotal[productExternalReferenceCode][
							'goalValue'
						],
					productExternalReferenceCode,
					productName:
						yearlyProductsTotal[productExternalReferenceCode][
							'productName'
						],
					totalSales:
						yearlyProductsTotal[productExternalReferenceCode][
							'totalSales'
						],
				});
			}
		);
		setProducts(newProductList);
	};

	const settingLabelsPeriod = () => {
		if (isLoading === true) {
			labelRef.current.categories(getData()[0]?.label);
		}
	};
	const settingAnnualRules = async () => {
		const annualRuleValues = await annualRule(
			currentDateString,
			january,
			yearToDateGoalsArray,
			yearToDateSalesArray,
			productValues
		);
		setYearToDateGoals(annualRuleValues[0]);

		setYearToDateSales(annualRuleValues[1]);

		if (lengthExceededColumn === indexOfCurrentMonth + 1) {
			setCurrentTooltip(yearToDateGoals);
			setIsLoading(true);
			settingLabelsPeriod();
		}
	};

	const settingSixMonthRule = async () => {
		const sixMonthRuleValues = await sixMonthRule(
			currentDateString,
			productValues,
			sixMonthsAgoDate,
			sixMonthsGoalsArray,
			sixMonthsSalesArray
		);
		setSixMonthsGoalsData(sixMonthRuleValues[0]);
		setSixMonthsSalesData(sixMonthRuleValues[1]);

		if (lengthExceededColumn === 6) {
			setCurrentTooltip(sixMonthsGoalsData);
			setIsLoading(true);
			settingLabelsPeriod();
		}
	};

	const settingThreeMonthRule = async () => {
		const threeMonthRuleValues = await threeMonthRule(
			currentDateString,
			threeMonthsAgoDate,
			threeMonthsGoalsArray,
			threeMonthsSalesArray,
			productValues
		);

		setThreeMonthsGoalsData(threeMonthRuleValues[0]);
		setThreeMonthsSalesData(threeMonthRuleValues[1]);

		if (lengthExceededColumn === 3) {
			setCurrentTooltip(threeMonthsGoalsData);
			setIsLoading(true);
			settingLabelsPeriod();
		}
	};

	// const tooltipRule = () => {
	// 	const chartBox = document.querySelector(
	// 		'.ray-dashboard-product-performance'
	// 	);
	// 	const tooltipContainer = chartBox?.querySelector(
	// 		'.bb-tooltip-container'
	// 	);
	// 	const tooltipList = tooltipContainer?.querySelectorAll(
	// 		'td.name'
	// 	) as NodeList;

	// 	console.log('list select', tooltipList);

	// 	if (tooltipList.length > 1) {
	// 		return tooltipContainer?.classList.add(
	// 			'bb-tooltip-container-hidden'
	// 		);
	// 	}

	// 	return tooltipContainer?.classList.remove(
	// 		'bb-tooltip-container-hidden'
	// 	);
	// };

	// const chartBox = document.querySelector(
	// 	'.ray-dashboard-product-performance'
	// );
	// const chartContainer = chartBox?.querySelector('g.bb-chart');
	// const bars = chartContainer?.querySelectorAll(
	// 	'rect.bb-event-rect'
	// ) as NodeList;

	// bars[0].setAttribute("width", 22);

	useEffect(() => {
		productsBaseSetup();

		if (timePeriod === '0') {
			if (windowSize.width > 992) {
				settingAnnualRules();

				// paddingValue = 100;

				widthValue = 15;
			} else if (windowSize.width < 992 && windowSize.width > 767.98) {
				settingAnnualRules();

				// paddingValue = 150;

				widthValue = 10;
			} else {
				settingAnnualRules();

				// paddingValue = 250;

				widthValue = 10;
			}
		}

		if (timePeriod === '1') {
			if (windowSize.width > 992) {
				settingSixMonthRule();

				// paddingValue = 100;

				widthValue = 20;
			} else if (windowSize.width < 992 && windowSize.width > 767.98) {
				settingSixMonthRule();

				// paddingValue = 100;

				widthValue = 20;
			} else {
				settingSixMonthRule();

				// paddingValue = 100;

				widthValue = 20;
			}
		}

		if (timePeriod === '2') {
			if (windowSize.width > 992) {
				settingThreeMonthRule();

				// paddingValue = 100;

				widthValue = 30;
			} else if (windowSize.width < 992 && windowSize.width > 767.98) {
				settingSixMonthRule();

				// paddingValue = 100;

				widthValue = 20;
			} else {
				settingSixMonthRule();

				// paddingValue = 100;

				widthValue = 20;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lengthExceededColumn, isLoading, timePeriod, productValues]);

	const handleProductFilterToggle = (
		productExternalReferenceCode: string
	) => {
		const newProducts = products.map((product) => {
			product.productExternalReferenceCode ===
			productExternalReferenceCode
				? (product.active = true)
				: (product.active = false);

			return product;
		});
		setProductsValues(productExternalReferenceCode);
		setProducts(newProducts);
	};

	const isFilterAllActive = (product: ProductCell) => !product.active;

	const findActiveProduct = products.find((product) => product.active)
		?.productName;

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
									setProductsValues('All');
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
							setIsLoading(false);
						}}
						sizing="sm"
						value={timePeriod}
					>
						{TIME_PERIODS.map((timePeriod, index) => (
							<ClaySelect.Option
								key={index}
								label={timePeriod.label}
								value={timePeriod.value}
							/>
						))}
					</ClaySelect>
				</div>

				<div className="p-md-5 px-2 py-3" id="chart-container-1">
					{isLoading && (
						<ClayChart
							axis={{
								x: {
									height: 65,
									label: {
										position: 'outer-center',
										text: 'Period (Month)',
									},
									position: {x: 30},
									show: true,
									type: 'category',
								},
								y: {
									label: {
										position: 'outer-middle',
										text: 'Dollar ($)',
									},
									padding: {
										left: 200,
										right: 200,
									},
									show: true,
									tick: {
										format(x: string) {
											return '$' + x;
										},
										stepSize: 10000,
									},
								},
							}}
							bar={{
								width: widthValue,
							}}
							data={dataChart}
							grid={{
								x: {
									show: false,
								},
								y: {
									show: true,
								},
							}}
							legend={{
								item: {
									onover: () => {
										return false;
									},
								},
								show: true,
							}}
							padding={{
								right: paddingValue,
							}}
							ref={labelRef}
							size={{
								height: BarChartPerformancee.height,

								// width: BarChartPerformancee.width,
							}}
							tooltip={tooltip}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductPerformance;
