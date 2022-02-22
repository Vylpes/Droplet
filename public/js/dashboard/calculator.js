$(document).ready(() => {
    const contextThis = this;

    contextThis.IniteBayFeesCalculator();
});

function IniteBayFeesCalculator() {
    const contextThis = this;

    const form = document.querySelector('#fees-calculator');

    form.addEventListener('submit', (e) => contextThis.eBayFeesCalculatorOnSubmit(e, form));
}

function eBayFeesCalculatorOnSubmit(e, form) {
    e.preventDefault();

    // Constants
    const vat = 1.2;
    const fixed = 0.3;

    // Inputs
    const itemBuyPrice = Number(form.querySelector('[data-item-buy-price]').value);
    const itemSellPrice = Number(form.querySelector('[data-item-sell-price]').value);
    const shippingCostToBuyer = Number(form.querySelector('[data-shipping-cost-to-buyer]').value);
    const actualShippingCost = Number(form.querySelector('[data-actual-shipping-cost]').value);
    const feesRate = Number(form.querySelector('[data-fees-rate]').value) / 100;

    // Outputs
    const result = document.querySelector('#fees-calculator-result');
    const totalFees = result.querySelector('#total-fees');
    const profit = result.querySelector('#profit');

    // Calculations
    const calcTotalFees = ((((itemSellPrice) + shippingCostToBuyer) * feesRate) * vat) + fixed;
    const calcProfit = (itemSellPrice + shippingCostToBuyer) -
        (itemBuyPrice + actualShippingCost + calcTotalFees);
    
    // Results
    totalFees.innerText = calcTotalFees.toFixed(2);
    profit.innerText = calcProfit.toFixed(2);
}