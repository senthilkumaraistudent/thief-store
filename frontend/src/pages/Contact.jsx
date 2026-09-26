import WaIcon from "../components/WaIcon";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "918122580147";

function generalWaLink() {
  const text = encodeURIComponent("Hi THIEF STORE 👋\n\nI'd like to know more about your collection.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function Contact() {
  return (
    <div className="view active"><div className="simple-page">
      <h1>Get in touch</h1>
      <p>Questions about sizing, fabric, or an order? Reach us directly on WhatsApp or Instagram.</p>
      <div className="contact-cards">
        <div className="cc">
          <h4>WHATSAPP</h4>
          <p>+91 81225 80147</p>
          <p style={{ fontSize: 11.5, color: "var(--muted-2)", margin: "-8px 0 12px" }}>Alt: +91 80568 32077</p>
          <a className="btn wa sm" target="_blank" rel="noopener noreferrer" href={generalWaLink()}><WaIcon />Message us</a>
        </div>
        <div className="cc">
          <h4>INSTAGRAM</h4>
          <p>@thief_store_</p>
          <a className="btn ghost sm" target="_blank" rel="noopener noreferrer" href="https://instagram.com/thief_store_">Visit profile</a>
        </div>
      </div>
      <div style={{ marginTop: 36 }}>
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>
          DELIVERY AREAS
        </h4>
        <div className="delivery-list"><span>All over India</span></div>
      </div>
    </div></div>
  );
}
