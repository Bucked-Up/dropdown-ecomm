# Scripts for handling upsells and lps

## How to put into instapage

### 1. Place this code into html/css head, change primary and secondary as needed.

```
<style>
  :root{
    --primary: #0038FF;
    --secondary: #E3F5FF;
    --text-color: black;
  }
  /* if dropdowns, put the id of each dropdown html block. */
  #element-990,#element-986{
    max-height: 2.9456rem !important;
  }
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Bucked-Up/dropdown-ecomm@1/src/scss/style.css" />
```

### 2. Place this code into a html block, where you want the product to be (one for each product) (change the 999 for the product id)

#### If the product has multiple options, add multiple blocks with -index. ex: prod-999-0, prod-999-1, etc.

```
<div class="products-list prod-999-0">

</div>
```

### 2.0 If tshirt, place this one as well

```
<div class="products-list prod-999-1">

</div>
```

### 2.1. The div can have the following classes:

1. has-dropdown: will be a dropdown

2. has-dropdown-mobile: will be dropdown only on mobile

3. has-img: will show image above the buttons or dropdown

4. has-img-desktop: will show image only on desktop

5. no-name-mobile: will remove the name from the button on mobile

### 2.2. The div can have the following attributes:

1. dropdown-text: there wont be a selected variant from the start.

### 3. Place this code and change as necessary into html/css footer

you can add how much you want from the product depending on the button and the products you want from the specific button.
(the quantity in the "products" takes priority)
Ex:

```
const buyButtonsIds = ["#element-1",{id: "#element-2", quantity: 2, products:'{"991": {"quantity": 1},"992": {"quantity": 2}}'}]
```

```
<script>
  const urlParams = new URLSearchParams(window.location.search);
  const step_count = "";
  const page_id = "";
  const version_id = "";
  const urlParamsCookies = ["click_id","utm_source","utm_medium","utm_campaign","utm_term","utm_content"]
  const discountCode = "";

  const isFirstPage = true;
  const isFinalPage = false;

  const country = null;
  const buyRedirect = ``;

  const params = {cc: discountCode};
  for (let key in params) {
    urlParams.set(key, params[key]);
  }

  const productsID = [999, 999]; //ID of each the product
  const hiddenProducts = [999];
  const buyButtonsIds = []; //IDs of each button of each product(in the order put in productID).
  const noThanksButtonsIds = [];
  const redirectUrl = `https://.com?${urlParams}`;
  const noThanksRedirect = `https://.com?${urlParams}`;

  //stop here.
  const origin = window.location.pathname.replace("/", "").replace("/", "");
  const cookieConfig = "path=/; domain=.buckedup.com;max-age=3600"
  document.cookie = `offer_id=${discountCode};${cookieConfig}`;
  document.cookie = `page_id=${page_id};${cookieConfig}`;
  urlParamsCookies.forEach(param=>{
    document.cookie = `${param}=${urlParams.get(param)};${cookieConfig}`;
  })
  if (isFirstPage) localStorage.setItem("first_page", origin);

</script>
<script src="https://cdn.jsdelivr.net/gh/Bucked-Up/dropdown-ecomm@1/src/js/scripts.js" type="module"></script>
```

## How to compile scss

### either install the compiler from the sass website, or install the vscode extension live sass compiler.
