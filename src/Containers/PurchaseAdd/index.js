import { useEffect, useState } from "react";
import { useStore } from "../../Store/store";
import { getVendors } from "../../apis/vendors";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ACTION } from "../../Store/constants";
import { PaymentTypesLits } from "../../Constants/Purchase";
import { PURCHASEBILLINFO, PURCHASEPRODUCTINFO, purchasebilldetail, purchaseproductdetail } from "../../Schema/purchase";
import { getAllProducts } from "../../apis/products";
import { addPurchaseDetial, getPurchase } from "../../apis/purchase";
import { checkIfMissingValues, getNet, getTotal, removeBlankRow } from "../../utils/purchase";
import { ROUTES } from "../../Constants/routes_frontend";
import { getyyyymm, getyyyymmdd } from "../../utils/DateConverter";


import './index.css'

import Layout from "../../Components/Layout/Layout";
import Card from "../../Components/ManualAddProduct/Card";
import ProductAddForm from "../../Components/ProductAddForm/ProductAddForm";

const PurchaseAdd = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const { dispatch, vendors, products } = useStore();
  const [purchaseBillDetail, setPurchaseBill] = useState(purchasebilldetail)
  const [purchaseProducts, setPurchaseProducts] = useState(Array.from({ length: 5 }, (_, index) => purchaseproductdetail))
  const [vendorslist, setVendorlist] = useState([]);
  const [productslist, setProductslist] = useState([]);
  const [mode, setMode] = useState("add")

  const formatevendorslist = (vendorss) => {
    const vendorsoption = vendorss.map((vendor) => {
      return { label: vendor.vendorName, value: vendor._id }
    })
    setVendorlist([{ label: "Select Vendor", value: "" }, ...vendorsoption])
  }

  const formateproductslist = (productss) => {
    const productoptions = productss.map((product) => {
      return { label: product.itemName, value: product._id, category: product.category }
    })
    setProductslist([{ label: "Select Product", value: "" }, ...productoptions])
  }

  const fetchVendorsList = async () => {
    try {
      const res = await getVendors();
      formatevendorslist(res.data)
      dispatch(ACTION.SET_VENDORS, res.data)
    } catch (error) {
      alert("Unable to get vendors list!")
    }
  }

  const fetchProductsList = async () => {
    try {
      const res = await getAllProducts();
      formateproductslist(res.data)
      dispatch(ACTION.SET_PRODUCTS, res.data)
    } catch (error) {
      alert("Unable to get products list!")
    }
  }

  const onchangeBillDetail = (name, value) => {
    setPurchaseBill({ ...purchaseBillDetail, [name]: value })
  }

  const onchangeproductlist = (index, name, value) => {
    try {
      setPurchaseProducts(purchaseProducts.map((detail, ind) => {
        if (ind === index) {
          if (name === PURCHASEPRODUCTINFO.PRODUCTID) {//feeding extra detail needed to calculate netrate later
            const selectedProd = products.filter((prod, index) => prod._id === value)[0]
            if (selectedProd)
              return { ...detail, [name]: value, itemName: selectedProd.itemName, pkg: selectedProd.pkg, category: selectedProd.category, gst: selectedProd.gst, vId: purchaseBillDetail.vId }
          }
          else if (name === PURCHASEPRODUCTINFO.QNT || name === PURCHASEPRODUCTINFO.SC || name === PURCHASEPRODUCTINFO.RATE || name === PURCHASEPRODUCTINFO.CD || name === PURCHASEPRODUCTINFO.FREE) {
            let { netvalue, nettax, netamt, netrateperunit } = getNet(name, purchaseProducts[index], value)
            let { totalvalue, totaltax, totalamt } = getTotal(purchaseProducts, index, netamt, netvalue, nettax)
            setPurchaseBill({ ...purchaseBillDetail, totalAmt: totalamt, totalValue: totalvalue, totalTax: totaltax })

            return { ...detail, [name]: value, netValue: netvalue, netAmt: netamt, netRate: netrateperunit, netTax: nettax }
          }
          else if (name === PURCHASEPRODUCTINFO.GST || name === PURCHASEPRODUCTINFO.TOTAL_VALUE)
            return detail
          return { ...detail, [name]: value }
        }
        else
          return detail
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const onsubmit = () => {
    if (mode === "add")
      addPurchase()
    else
      updatePurchase()
  }

  const addPurchase = async () => {
    try {
      const cleared_productlist = removeBlankRow(purchaseProducts)
      if (checkIfMissingValues(purchaseBillDetail, cleared_productlist))
        alert("No missing values allowed")
      else {
        const data = {
          billInfo: purchaseBillDetail,
          productsDetail: cleared_productlist
        }
        const res = await addPurchaseDetial(data)
        setPurchaseProducts(Array.from({ length: 5 }, (_, index) => purchaseproductdetail))
        setPurchaseBill(purchasebilldetail)
        alert("Pruchase updated successfully!")
        dispatch(ACTION.SET_STOCKS, [])
      }
    } catch (error) {
      console.log(error)
      alert("Unable to add purchase entry!")
    }
  }

  const updatePurchase = async () => {

  }

  const addField = () => {
    setPurchaseProducts([...purchaseProducts, {}])
  }

  const deleteField = (index) => {
    setPurchaseProducts(purchaseProducts.filter((_, ind) => ind !== index))
  }

  const fetchPurchase = async (id) => {
    try {
      const res = await getPurchase(id);
      const res_data = res.data
      const calc_data = res_data.productsDetail.map((prod) => {
        return { ...prod, expDate: getyyyymm(prod.expDate), gst: Math.round((prod.netTax / prod.qnty) * 100 / prod.rate) }
      })
      setPurchaseProducts(calc_data)
      delete res_data.productsDetail
      res_data.purDate = getyyyymmdd(res_data.purDate)
      setPurchaseBill(res_data)
    } catch (error) {
      console.log(error)
      alert("Unable to get purchase information!")
      navigate(ROUTES.PROTECTED_ROUTER + ROUTES.PURCHASE)
    }
  }

  const oncancel = () => {
    navigate(ROUTES.PROTECTED_ROUTER + ROUTES.PURCHASE)
  }

  useEffect(() => {
    const purchaseId = searchParams.get("id")
    if (vendors.length) { formatevendorslist(vendors) }
    else fetchVendorsList();
    if (products.length) { formateproductslist(products) }
    else fetchProductsList();
    if (purchaseId) {
      fetchPurchase(purchaseId)
      setMode("update")
    }
  }, [])

  return (
    <Layout>
      <div id="purchaseadd-container" className="layout-body borderbox">
        <p style={{ width: "100%", fontSize: "1.5rem", margin: "0px", fontWeight: "500", textAlign: "left", borderBottom: "2px solid #D6D8E7", paddingBottom: "5px", display: "flex", marginBottom: "2vh" }}>Purchase Entry</p>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", height: "15%", width: "100%" }}>
          <Card focus={true} require={true} value={purchaseBillDetail.vId} m="1.5% 0px" w="25%" h="15%" name={PURCHASEBILLINFO.VENDORID} label="Vendor Name" onchange={onchangeBillDetail} type="select" options={vendorslist} />
          <Card require={true} value={purchaseBillDetail.billNo} m="1.5% 1%" w="15%" h="15%" name={PURCHASEBILLINFO.BILLNUMBER} label="Bill No." onchange={onchangeBillDetail} type="text" />
          <Card require={true} value={purchaseBillDetail.purDate} m="1.5% 1%" w="15%" h="15%" name={PURCHASEBILLINFO.PURCHASEDATE} label="Purchase Date" onchange={onchangeBillDetail} type="date" />
          <Card require={true} value={purchaseBillDetail.paymentType} m="1.5% 1%" w="10%" h="15%" name={PURCHASEBILLINFO.PAYMENTTYPE} label="Payment Type" onchange={onchangeBillDetail} type="select" options={PaymentTypesLits} />
        </div>
        {
          purchaseProducts.length > 0 ?
            <ProductAddForm oncancel={oncancel} mode={mode} onSubmit={onsubmit} addField={addField} deleteField={deleteField} purchaseProducts={purchaseProducts} products={productslist} onChange={onchangeproductlist} /> : <></>
        }
        <div style={{ width: "100%", height: "10%", display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
          <div style={{ height: "100%", width: "10%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "1.2rem", margin: "0px", width: "100%", textAlign: "left" }}>Sub total: </p>
            <p style={{ fontSize: "1.2rem", margin: "0px", width: "100%", textAlign: "left" }}>Tax: </p>
            <p style={{ fontSize: "1.2rem", margin: "0px", width: "100%", textAlign: "left" }}>Grand total: </p>
          </div>
          <div style={{ height: "100%", width: "10%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
            <input style={{ border: "none", width: "90%", fontSize: "1.2rem" }} readOnly value={purchaseBillDetail.totalValue} />
            <input style={{ border: "none", width: "90%", fontSize: "1.2rem" }} readOnly value={purchaseBillDetail.totalTax} />
            <input style={{ border: "none", width: "90%", fontSize: "1.2rem" }} readOnly value={purchaseBillDetail.totalAmt} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PurchaseAdd;