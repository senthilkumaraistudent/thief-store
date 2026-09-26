import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="view active"><div className="simple-page">
      <h1>About THIEF STORE</h1>
      <p>
        THIEF STORE is a growing men's streetwear brand focused on bold, stylish clothing at
        accessible pricing. We keep things simple: honest product information, fair prices, and a
        straightforward way to order — WhatsApp.
      </p>
      <p>
        Many pieces we carry are single, limited pieces — once a size or print is gone, it's gone.
        We're building this brand one drop at a time, and we care about getting the basics right:
        quality fabric, honest fit information, and a customer experience you can trust.
      </p>
      <Link to="/shop" className="btn">Browse the shop</Link>
    </div></div>
  );
}
