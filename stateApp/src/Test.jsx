import React, { useState, useEffect } from "react";
import { GetDatas } from "./api/getRequest";
import { toast } from "react-toastify";
import { Modal, Button, Spinner } from "react-bootstrap";

function RecipesManager() {
  const [datas, setDatas] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState({ type: "", data: [] });
  const [modalIsOpenRmv, setModalIsOpenRmv] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [loading, setLoading] = useState(true);

  const openModal = (type, data) => {
    setModalData({ type, data });
    setModalIsOpen(true);
  };

  const handleData = async () => {
    setLoading(true);
    try {
      const response = await GetDatas();
      setDatas(response.recipes);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load products!", {
        autoClose: 1500,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedItem = localStorage.getItem("recipes");
    if (savedItem) {
      setRecipes(JSON.parse(savedItem));
    }
    handleData();
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }
  }, [recipes]);

  const addRecipes = (item) => {
    if (!recipes.some((recipe) => recipe.id === item.id)) {
      const newItem = { ...item, nickname: item.name, count: 1 };
      setRecipes((prevRecipes) => {
        const updatedRecipes = [...prevRecipes, newItem];
        localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
        return updatedRecipes;
      });
      toast.success(`${item.name} added to your team!`, {
        autoClose: 1500,
      });
    } else {
      toast.warning("Already exist!", {
        autoClose: 1500,
      });
    }
  };

  const deleteRecipe = () => {
    if (itemToRemove) {
      const updatedRecipes = recipes.filter(
        (item) => item.id !== itemToRemove.id
      );
      setRecipes(updatedRecipes);
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      toast.success(`${itemToRemove.name} removed from your list!`, {
        autoClose: 1500,
      });
    }
    setModalIsOpenRmv(false);
  };

  const openRemoveModal = (item) => {
    setItemToRemove(item);
    setModalIsOpenRmv(true);
  };

  const isExist = (itemId) => {
    return recipes.some((recipe) => recipe.id === itemId);
  };

  return (
    <div
      style={{ maxWidth: "1200px", margin: "15px auto", textAlign: "center" }}
    >
      <h1 style={{ color: "#cefefd" }}>World cuisine recipes</h1>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {loading ? (
          <div
            className="d-flex justify-content-center"
            style={{ width: "100%", height:"100vh" }}
          >
            <Spinner animation="border" variant="primary" className="mt-5"/>
          </div>
        ) : (
          datas?.map((item) => (
            <div
              key={item.id}
              style={{
                margin: "10px",
                width: "250px",
                height: "250px",
                backgroundColor: "#cefefd",
                border: "2px solid #17faf7",
                borderRadius: "8px",
                boxShadow: "10 12px 18px rgba(250, 185, 243, 0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <p className="mt-2">{item.name}</p>
              <div>
                Cuisine: <span>{item.cuisine}</span>
              </div>

              <button
                onClick={() => addRecipes(item)}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  backgroundColor: isExist(item.id) ? "#01615a" : "#00abd1",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {isExist(item.id) ? "Added" : "Get Recipe"}
              </button>
            </div>
          ))
        )}
      </div>
      <h4 className="mt-2">Your Pokémon Team</h4>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {recipes?.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "#d3e9fe",
              borderRadius: "8px",
              border: "2px solid #48b1f8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
              <h6>{item.nickname}</h6>
            </div>

            <div className="d-flex align-items-center">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="info"
                  onClick={() => openModal("ingredients", item.ingredients)}
                >
                  Ingredients
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => openModal("instructions", item.instructions)}
                  className="mx-2"
                >
                  Instructions
                </Button>
              </div>

              <Button variant="danger" onClick={() => openRemoveModal(item)}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-capitalize">
            {modalData.type}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {modalData.data?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalIsOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalIsOpenRmv} onHide={() => setModalIsOpenRmv(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{itemToRemove?.name}</strong>
          from your team?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalIsOpenRmv(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteRecipe}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RecipesManager;
