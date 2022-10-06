import { useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import data from './../data.js'
import { useState, useEffect } from "react";
import Pagination from 'react-bootstrap/Pagination';

function ContentsList(props) {
  const [resize, setResize] = useState(window.innerWidth);

  const handleResize = () => {
    setResize(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  let { categoryName, itemName } = useParams();
  let [totalData, setTotalData] = useState(data);

  let contentsData = totalData.find(function (x) {
    return x.category == categoryName & x.item == itemName
  })

  if (contentsData === undefined) {
    return (
      <div> 없는 제품입니다. </div>
    )
  }

  return(
    <div>
      <h4>{categoryName}</h4>
      <h6>{itemName}</h6>
      <Table hover size="md" className="Table-row">
        <TableHeader resize={resize} />
        <tbody>
          {
            contentsData.contents.map((cData, idx)=>{
              return(
                <TableRow key={idx} cData={cData} resize={resize} />
              )
            })
          }
        </tbody>
      </Table>
      <Page />
    </div>
  )
}

function Page() {
  return(
    <Pagination size="sm" style={{alignItems: 'center', justifyContent: 'center'}}>
      <Pagination.First />
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Item>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Item>{4}</Pagination.Item>
      <Pagination.Item>{5}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  )
}

function TableRow({cData, resize}){
  if (resize >= 1080) {
    return(
      <tr>
        <td>{cData.id}</td>
        <td>
          <img style={{width: "50px"}} src={cData.image} />
        </td>
        <td>{cData.name}</td>
        <td>{cData.state}</td>
        <td>{cData.price}</td>
        <td>{cData.like}</td>
        <td>{cData.comments}</td>
        <td>{cData.source}</td>
        <td>{cData.date}</td>
      </tr>
    )
  }
  else {
    return (
      <tr>
        <td>{cData.name}</td>
        <td>{cData.state}</td>
        <td>{cData.price}</td>
        <td>{cData.source}</td>
      </tr>
    )
  }
  
}


function TableHeader({resize}) {
  if (resize >= 1024){
    return (
      <thead>
        <tr>
          <th>No.</th>
          <th>Image</th>
          <th>Product Name</th>
          <th>State</th>
          <th>Price</th>
          <th>Like</th>
          <th>Comments</th>
          <th>Source</th>
          <th>Date</th>
        </tr>
      </thead>
    )
  }
  else {
    return (
      <thead>
        <tr>
          <th>Product Name</th>
          <th>State</th>
          <th>Price</th>
          <th>Source</th>
        </tr>
      </thead>
    )
  }
}

export default ContentsList;