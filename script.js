const amountInput = document.getElementById("amountInput");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultValue = document.getElementById("resultValue");
const resultMeta = document.getElementById("resultMeta");
const statusBadge = document.getElementById("statusBadge");
const swapButton = document.getElementById("swapButton");
const popularRates = document.getElementById("popularRates");
const converterForm = document.getElementById("converterForm");

const POPULAR_PAIRS = [
  ["USD", "INR"],
  ["EUR", "USD"],
  ["GBP", "INR"],
  ["JPY", "USD"]
];
const CURRENCIES = {
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  EUR: "Euro",
  GBP: "British Pound",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  SGD: "Singapore Dollar",
  USD: "United States Dollar"
};
const REFERENCE_RATES = {
  AUD: 1.53,
  CAD: 1.37,
  CHF: 0.91,
  CNY: 7.24,
  EUR: 0.93,
  GBP: 0.8,
  INR: 83.45,
  JPY: 155.2,
  SGD: 1.35,
  USD: 1
};

let currencyMap = CURRENCIES;

function populateSelects(currencies) {
  const options = Object.entries(currencies)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => `<option value="${code}">${code} - ${name}</option>`)
    .join("");

  fromCurrency.innerHTML = options;
  toCurrency.innerHTML = options;

  fromCurrency.value = "USD";
  toCurrency.value = "INR";
}

function getExchangeRate(from, to) {
  const fromRate = REFERENCE_RATES[from];
  const toRate = REFERENCE_RATES[to];

  if (!fromRate || !toRate) {
    throw new Error("Currency rate not available.");
  }

  return toRate / fromRate;
}

function convertCurrency() {
  const amount = Number(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0) {
    resultValue.textContent = "--";
    resultMeta.textContent = "Enter a valid amount to convert.";
    statusBadge.textContent = "Waiting for input";
    return;
  }

  try {
    const rate = getExchangeRate(from, to);
    const converted = amount * rate;
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: to,
      maximumFractionDigits: 2
    }).format(converted);

    resultValue.textContent = formatted;
    resultMeta.textContent = `1 ${from} = ${rate.toFixed(4)} ${to} | Based on stored offline reference rates`;
    statusBadge.textContent = "Offline ready";
  } catch (error) {
    resultValue.textContent = "--";
    resultMeta.textContent = "Conversion is unavailable for the selected currencies.";
    statusBadge.textContent = "Rate missing";
    console.error(error);
  }
}

function loadPopularRates() {
  const cards = POPULAR_PAIRS.map(([from, to]) => {
    const value = getExchangeRate(from, to);
    return `
      <article class="rate-item">
        <div>
          <strong>${from} to ${to}</strong>
          <span>${currencyMap[from] || from} / ${currencyMap[to] || to}</span>
        </div>
        <strong>${value.toFixed(4)}</strong>
      </article>
    `;
  });

  popularRates.innerHTML = cards.join("");
}

function swapCurrencies() {
  const currentFrom = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = currentFrom;
  convertCurrency();
}

function initializeApp() {
  populateSelects(currencyMap);
  loadPopularRates();
  convertCurrency();
}

converterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  convertCurrency();
});
amountInput.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);
swapButton.addEventListener("click", swapCurrencies);

initializeApp();
