import React from "react";
import ReactBootstrap from "react";
import axios from "axios";
import {
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Image,
  input,
  Spinner,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
// Simulate getting products from DataBase

//=========Cart=============

const Products = (props) => {
  const products = [
    { name: "Apples_:", country: "Italy", cost: 3, instock: 10 },
    { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
    { name: "Beans__:", country: "USA", cost: 2, instock: 5 },
    { name: "Cabbage:", country: "USA", cost: 1, instock: 8 },
  ];
  // const Cart = (props) => {
  //   const { Card, Accordion, Button } = ReactBootstrap;
  //   let data = props?.location?.data ? props?.location?.data : products;
  //   console.log(`data:${JSON.stringify(data)}`);

  //   const list = data?.map((item, index) => (
  //     <Accordion.Item eventKey={index} key={index}>
  //       <Accordion.Header>{item.name}</Accordion.Header>
  //       <Accordion.Body>
  //         Cost: {item.cost} | Stock: {item.instock}
  //       </Accordion.Body>
  //     </Accordion.Item>
  //   ));

  //   return <Accordion defaultActiveKey="0">{list}</Accordion>;
  // };

  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
    console.log(`useDataApi called`);
    useEffect(() => {
      console.log("useEffect Called");
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          console.log("FETCH FROM URl");
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  console.log("cart", cart);

  const [total, setTotal] = React.useState(0);

  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products/");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products/",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data
  const addToCart = (e) => {
    console.log("e", e);

    let name = e.name;
    let item = items.filter((item) => item.name === name);
    console.log("item", item);

    if (item[0].instock === 0) return;
    item[0].instock = item[0].instock - 1;
    console.log("item final", item);
    console.log("[...cart, ...item]", [...cart, ...item]);

    // console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    //doFetch(query);
  };
  const deleteCartItem = (delIndex) => {
    let newCart = cart.filter((item, i) => delIndex !== i);
    let target = cart.filter((item, index) => delIndex === index);
    let newItems = items.map((item, index) => {
      if (item.name === target[0].name) item.instock = item.instock + 1;
      return item;
    });
    setCart(newCart);
    setItems(newItems);
  };
  //const photos = ["apple.png", "orange.png", "beans.png", "cabbage.png"];

  let list = items.map((item, index) => {
    let n = index + 1049;
    let uhit = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index}>
        <Image src={uhit} width={70} roundedCircle></Image>
        <Button variant="primary" size="large">
          {item.name}:${item.cost}-Stock={item.instock}
        </Button>
        <input
          name={item.name}
          type="submit"
          onClick={() => addToCart(item)}
        ></input>
      </li>
    );
  });
  // let cartList = cart?.map((item, index) => {
  //   return (
  //     <Card key={index}>
  //       <Card.Header>
  //         <Accordion.Toggle as={Button} variant="link" eventKey={1 + index}>
  //           {item.name}
  //         </Accordion.Toggle>
  //       </Card.Header>
  //       <Accordion.Collapse
  //         onClick={() => deleteCartItem(index)}
  //         eventKey={1 + index}
  //       >
  //         <Card.Body>
  //           $ {item.cost} from {item.country}
  //         </Card.Body>
  //       </Accordion.Collapse>
  //     </Card>
  //   );
  // });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    //cart.map((item, index) => deleteCartItem(index));
    return newTotal;
  };
  const restockProducts = (url) => {
    const response = doFetch(url);
    console.log("response----->", response);

    let newItems = data?.map((item) => {
      let { name, country, cost, instock } = item;
      return { name, country, cost, instock };
    });
    console.log("newItems", newItems);
    setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          {cart?.map((item, index) => {
            // console.log("item hereeeee", item);
            return (
              <Card key={index}>
                <Card.Title>{item?.name}</Card.Title>

                <Card.Text>
                  $ {item.cost} from {item.country}
                </Card.Text>
                <Button variant="primary" onClick={() => deleteCartItem(index)}>
                  Delete Item
                </Button>
              </Card>
            );
          })}
          {/* <Accordion>{cartList}</Accordion> */}
          {/* <div> {finalList().total > 0 && finalList().final} </div> */}
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            console.log(`Restock called on ${query}`);
            restockProducts(`http://localhost:1337/api/products/${query}`);

            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};

export default Products;
