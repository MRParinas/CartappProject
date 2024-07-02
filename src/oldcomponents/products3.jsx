import React, { useState, useEffect, useReducer } from "react";
import {
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Image,
  Form,
  Spinner,
  Card,
} from "react-bootstrap";
import axios from "axios";

const Products = () => {
  const products = [
    { name: "Apples", country: "Italy", cost: 3, instock: 10 },
    { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
    { name: "Beans", country: "USA", cost: 2, instock: 5 },
    { name: "Cabbage", country: "USA", cost: 1, instock: 8 },
  ];

  const useDataApi = (initialUrl, initialData) => {
    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });

    useEffect(() => {
      let didCancel = false;

      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });

        try {
          const result = await axios(url);
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

  const [items, setItems] = useState(products);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );

  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name === name)[0];
    if (item.instock === 0) return;
    item.instock--;
    setCart([...cart, item]);
  };

  const deleteCartItem = (index) => {
    let newCart = cart.filter((item, i) => index !== i);
    setCart(newCart);
  };

  const checkOut = () => {
    let total = cart.reduce((sum, item) => sum + item.cost, 0);
    return total;
  };
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

  const restockProducts = (url) => {
    console.log("url", url);

    doFetch(url);
    console.log("data.data", data.data);

    if (data.data) {
      let newItems = data.data.map((item) => {
        let { name, country, cost, instock } = item.attributes;
        return { name, country, cost, instock };
      });
      setItems([...items, ...newItems]);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>
            {items.map((item, index) => (
              <li key={index}>
                <Image
                  src={`https://picsum.photos/id/${index + 1049}/50/50`}
                  width={70}
                  roundedCircle
                />
                <Button variant="primary" size="large">
                  {item.name} - ${item.cost} - {item.instock} in stock
                </Button>
                <input name={item.name} type="submit" onClick={addToCart} />
              </li>
            ))}
          </ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion defaultActiveKey="0">
            {cart.map((item, index) => (
              <Accordion.Item key={index} eventKey={index.toString()}>
                <Accordion.Header>{item.name}</Accordion.Header>
                <Accordion.Body onClick={() => deleteCartItem(index)}>
                  $ {item.cost} from {item.country}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
        <Col>
          <h1>CheckOut</h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            restockProducts(`http://localhost:1337/api/${query}`);
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
