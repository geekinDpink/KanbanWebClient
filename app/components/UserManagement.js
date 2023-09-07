import React from "react";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function UserManagement() {
  return (
    <>
      <Row>
        <Col>
          <h3>User Management</h3>
        </Col>
        <Col>
          <Button>Create New User</Button>
        </Col>
      </Row>
      <Row>
        <Table bordered hover size="sm" style={{ marginLeft: "15px" }}>
          <thead>
            <tr>
              <th>S/N.</th>
              <th>Username</th>
              <th>Email</th>
              <th>User Group</th>
              <th>Active Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>To add dynamic user</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </>
  );
}
