import { fetchUrl, finishUrl, postUrl } from "../variables.js";
import toggleLoading from "./toggleLoading.js";
import { dataLayerRedirect, dataLayerBuy } from "./dataLayer.js";
import postApi from "./postApi.js";

const getVariantId = (productId, optionId) => {
  let variantId;
  const input = Array.from(document.querySelectorAll(`[name="${optionId}"]`)).filter((el) => el.checked)[0];
  if (!input) return { result: false, wrapper: document.querySelector(`[not-selected-id="${productId}-${optionId}"]`) };
  variantId = input.value;
  return { result: variantId };
};

const hasOptions = (prod) => {
  return prod.options.length > 0;
};
//updates order
const buy = async (btn, data, hiddenProd) => {
  const body = { order_uuid: urlParams.get("order_uuid"), items: {} };
  let notSelected = false;
  let totalPrice = 0;
  const quantity = btn.getAttribute("quantity") || 1;

  const btnProducts = JSON.parse(btn.getAttribute("products"));
  const filterProd = (product) => {
    if (Object.keys(btnProducts).includes(product.id)) {
      product.quantity = btnProducts[product.id].quantity;
      return true;
    }
    return false;
  };
  if (btnProducts) {
    data = data.filter((product) => filterProd(product));
    hiddenProd = hiddenProd.filter((product) => filterProd(product));
  }

  const getPrice = (price, productQuantity = undefined) => +price.split("$")[1] * (productQuantity || quantity);
  for (let product of data) {
    totalPrice = totalPrice + getPrice(product.price, product.quantity);
    body.items[product.id] = { product_id: product.id, quantity: product.quantity || quantity, options: {} };
    for (let option of product.options) {
      const currentVariant = getVariantId(product.id, option.id);
      if (!currentVariant.result) {
        currentVariant.wrapper.classList.add("shake");
        notSelected = true;
        continue;
      }
      body.items[product.id].options[option.id] = currentVariant.result;
      totalPrice = totalPrice + getPrice(option.values.find((obj) => obj.id == currentVariant.result).price, product.quantity);
    }
  }
  if (notSelected) {
    alert("Select your choices");
    return;
  }
  toggleLoading();
  body.items = Object.values(body.items);
  body.items.push(
    ...hiddenProd.map((prod) => {
      totalPrice = totalPrice + getPrice(prod.price, prod.quantity) + (hasOptions(prod) ? getPrice(prod.options[0].values[0].price, prod.quantity) : 0);
      const options = {};
      if (hasOptions(prod)) {
        const optionId = prod.options[0].id;
        const valueId = prod.options[0].values[0].id;
        options[optionId] = valueId;
      }
      return {
        options,
        product_id: prod.id,
        quantity: prod.quantity || quantity,
      };
    })
  );
  if (!isFirstPage) {
    if (country) body.country = country;
    const response = await postApi(postUrl, body);
    console.log(response);
    if (!response) window.location.href = buyRedirect;
    if (isFinalPage) {
      const response = await postApi(finishUrl, null);
      console.log(response);
      if (!response) window.location.href = buyRedirect;
    }
    dataLayerBuy([...data, ...hiddenProd], totalPrice);
    window.location.href = redirectUrl;
    return;
  }
  let string = "";
  body.items.forEach((product, i) => {
    string = string + `&products[${i}][id]=${product.product_id}&products[${i}][quantity]=${product.quantity}`;
    Object.keys(product.options).forEach((optionKey) => {
      string = string + `&products[${i}][options][${optionKey}]=${product.options[optionKey]}`;
    });
  });
  dataLayerRedirect([...data, ...hiddenProd]);
  window.location.href = `https://${country ? country + "." : ""}buckedup.com/cart/add?${string}&clear=true&${urlParams}`;
};

export default buy;
