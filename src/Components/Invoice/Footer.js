const Footer = ({ total, totalTax, discount, roundOff, grandTotal, amtPaid, amtDue }) => {
  return (
    <div style={{ width: "100%", height: "10vh", alignItems: "center", display: "flex", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", height: "15%", fontWeight: "bolder", margin: "0px", fontSize: "0.7em", width: "100%", textAlign: "center", borderBottom: "2px solid black" }}>Amt. in words. : <span></span></div>
      <div style={{ fontSize: "0.7rem", height: "85%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "0.5%", boxSizing: "border-box", width: "30%", borderRight: "2px solid black" }}>
        <p style={{ margin: "0px", fontSize: "1rem", fontWeight: "bold", borderBottom: "2px solid black" }}>Terms & Conditions</p>
        <p style={{ margin: "0px" }}>1.Goods once sold will not be taken back or exchanged.</p>
        <p style={{ margin: "0px" }}>2.All disputes subject to Raipur Jurisdication Only.</p>
      </div>
      <div style={{ fontSize: "0.6rem", height: "85%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "0.5%", boxSizing: "border-box", width: "25%", borderRight: "2px solid black" }}>
        <p style={{ margin: "0px" }}>Receiver's Signature:</p>
        <p style={{ margin: "0px" }}>Store Seal</p>
        <p style={{ margin: "0px" }}>For Agrawal Medical & General Store,Silyari</p>
        <p style={{ margin: "0px" }}>Authorized Signature</p>
      </div>
      <div style={{ fontSize: "0.7rem", flexWrap: "wrap", height: "85%", display: "flex", flexDirection: "row", justifyContent: "center", padding: "0.5%", boxSizing: "border-box", width: "45%" }}>
        <p style={{ margin: "0px", width: "30%" }}>DISCOUNT RS</p>
        <p style={{ margin: "0px", width: "20%" }}>: {discount}</p>
        <p style={{ margin: "0px", width: "30%" }}>SUB TOTAL</p>
        <p style={{ margin: "0px", width: "20%" }}>: {total}</p>
        <p style={{ margin: "0px", width: "30%" }}>ROUND OFF</p>
        <p style={{ margin: "0px", width: "20%" }}>: {roundOff}</p>
        <p style={{ margin: "0px", width: "30%" }}>GRAND TOTAL</p>
        <p style={{ margin: "0px", width: "20%" }}>: {grandTotal}</p>
        <p style={{ margin: "0px", width: "30%" }}>PAID</p>
        <p style={{ margin: "0px", width: "20%" }}>: {amtPaid}</p>
        <p style={{ margin: "0px", width: "30%" }}>AMT. DUE</p>
        <p style={{ margin: "0px", width: "20%" }}>: {amtDue}</p>
      </div>
    </div>
  );
}
export default Footer;