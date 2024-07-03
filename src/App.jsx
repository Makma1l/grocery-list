import Header from "./components/Header";
import SearchItem from "./components/SearchItem";
import AddItem from "./components/AddItem";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import Content from "./components/Content";

function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState("");
  const [newItem, setNewItem] = useState("");
  const api_url = "http://localhost:3000";

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch(`${api_url}/items`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error with network: ${errorText}`);
        }

        const newItems = await response.json();
        setItems(newItems);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching items", error.message);
        setFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    setTimeout(() => {
      fetchItems();
    }, 2000);
  }, []);

  async function addItem() {
    const id = Date.now();
    const item = {
      id,
      item: newItem,
      checked: false,
    };

    try {
      const response = await fetch(`${api_url}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const result = await response.json();
      setItems([...items, result]); 
      setNewItem(""); 
    } catch (error) {
      console.error("Error adding item", error.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    addItem();
  }

  const filteredItems = items.filter((item) =>
    item.item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading...</p>}
        {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}
        {search && filteredItems.length === 0 && <p>Not found</p>}
        {!isLoading && !fetchError && <Content items={filteredItems} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
