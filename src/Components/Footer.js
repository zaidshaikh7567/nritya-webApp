import React from 'react'
import { Row,Col } from 'react-bootstrap'

function Footer() {
  return (
    <div>
        <footer style={{ backgroundColor: '#2c1160',  height: 1}}>
        <Row>
           <Col className ='text-center py-1 ' style={{  color: '#e78f4c' ,fontFamily:'Times-Roman',fontSize:12}}> 
           &copy;N 2023
            </Col>
            </Row>
        </footer>
    </div>
  )
}

export default Footer