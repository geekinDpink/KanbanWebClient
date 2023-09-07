import React from "react";
import { Container } from "react-bootstrap";

export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <Container>
      <p>Copyright {year}</p>
    </Container>
  );
}
