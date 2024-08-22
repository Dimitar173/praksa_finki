import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { fetchProducts } from '../../api/productsApi';
import { Product } from '../../models/Product';
import "font-awesome/css/font-awesome.min.css";
import './HomePage.css';
import AddProductDialog from '../../dialogs/addProduct/AddProductDialog';
import ProductDialog from '../../dialogs/viewProduct/ProductDialog';
import { simulateDeleteProduct } from '../../api/deleteProductApi';


const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortByTitleAsc, setSortByTitleAsc] = useState<boolean>(false);
    const [sortByPriceAsc, setSortByPriceAsc] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isAddProductDialogOpen, setAddProductDialogOpen] = useState<boolean>(false);
    const [isProductDialogOpen, setProductDialogOpen] = useState<boolean>(false);
    const [lastProductId, setLastProductId] = useState<number>(0);
    const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined)

    const toggleSortByTitle = (): void => {
        setSortByTitleAsc(!sortByTitleAsc);
        sortProductsByTitle(!sortByTitleAsc);
    };

    const toggleSortByPrice = (): void => {
        setSortByPriceAsc(!sortByPriceAsc);
        sortProductsByPrice(!sortByPriceAsc);
    };

    const sortProductsByTitle = (ascending: boolean): void => {
        const sortedProducts = [...products].sort((a, b) => {
            return ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        });
        setProducts(sortedProducts);
    };

    const sortProductsByPrice = (ascending: boolean): void => {
        const sortedProducts = [...products].sort((a, b) => {
            return ascending ? a.price - b.price : b.price - a.price;
        });
        setProducts(sortedProducts);
    };

    // const fetchProductsByCategoryId = async (categoryId: number) => {
    //     try {
    //       const data = await fetchProduct(categoryId);
    //       setSelectedProduct(data);
    //     } catch (error) {
    //       console.error('Error fetching product by category id:', error);
    //     }
    //   };

    // const selectProduct = (product: Product): void => {
    //     fetchProductsByCategoryId(product.categoryId); - I prefer to use this, but there's two products with same categoryId...
    //     setSelectedProduct(product);
    // };

    const toggleAddProductDialog = (id?: number): void => {
        if(id && !isAddProductDialogOpen){
            setSelectedProductId(id)
        } else if(!id && isAddProductDialogOpen) {
            setSelectedProductId(undefined)
            setSelectedProduct(null)
        } else  {
            setSelectedProduct(null)
        }
        setAddProductDialogOpen(!isAddProductDialogOpen);
    };

    const updateProducts = (newProduct: Product): void => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setLastProductId(newProduct.id + 1);
    };

    const updateEdittedProduct = (newProduct: Product): void => {
        const index = products.findIndex(product => product.id === newProduct.id);

        if (index !== -1) { //check if element is found in the list
            const updatedProducts = [...products];
            updatedProducts[index] = newProduct;
    
            setProducts(updatedProducts);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
                const maxId = data.reduce((max, product) => (product.id > max ? product.id : max), 0);
                setLastProductId(maxId + 1);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Add a resize event listener to check screen width
        const handleResize = (): void => {
            if (window.innerWidth <= 576) {
                setProductDialogOpen(true);
            } else {
                setProductDialogOpen(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const openProductModal = (product: Product): void => {
        setSelectedProduct(product);
        setProductDialogOpen(true);
    };

    const closeProductModal = (): void => {
        setProductDialogOpen(false);
        setSelectedProduct(null);
    };

    const deleteProduct = async (productId : number) => {
        try {
          await simulateDeleteProduct(productId);
    
          //updateProducts(newProduct);
    
        //   onClose();
        //   resetForm();
        } catch (error) {
    
          console.error('Error submitting form:', error);
        }
      };

    return (
        <React.Fragment>
            <Navbar />
            <div className='button-wrapper'>
                <div className="button-sort">
                    <button className="button sortTitle" onClick={toggleSortByTitle}>Sort by Title &nbsp; {sortByTitleAsc ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i>}</button>
                    <button className="button sortPrice" onClick={toggleSortByPrice}>Sort by Price &nbsp; {sortByPriceAsc ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i>}</button>
                </div>
                <div className='addProduct'>
                    <button className="button" onClick={() => toggleAddProductDialog()}><i className="fa fa-plus-circle"></i>&nbsp; Add Product</button>
                </div>
            </div>
            <div className="container">
                <div className="wrapper">
                    {products.map((product) => (
                        <div className="card" key={product.id} onClick={() => openProductModal(product)}>
                            <h3 className="card-title">
                                <span>ID</span>
                                <span>TITLE</span>
                                <span>STOCK</span>
                            </h3>
                            <h3 className="card-title subtitle">
                                <span>{product.id}</span>
                                <span>{product.title}</span>
                                <span>{product.stock ? "TRUE" : "FALSE"}</span>
                            </h3>
                            <div className="image-container">
                            <img src={product.picture} alt="" className='alt-image'/>
                            </div>
                            <p className="card-price">{product.price}$</p>
                        </div>
                    ))}
                </div>
                {window.innerWidth > 576 && selectedProduct && (
                    <div className="selected-product-details">
                        <div className="card" key={selectedProduct.id}>
                            <div className="card-content">
                                <h3 className="card-title card-font-size">
                                    <div className="left-section">
                                        <span>{selectedProduct.id} - {selectedProduct.title}</span>
                                    </div>
                                    <div className="right-section">
                                        <span>{selectedProduct.stock ? "THE PRODUCT IS IN STOCK" : "THE PRODUCT IS OUT OF STOCK"}</span> {/* concurrent rendering */}
                                        <span>{selectedProduct.price}$</span>
                                    </div>
                                    <div>
                                        <button className='edit-button' onClick={() => toggleAddProductDialog(selectedProduct.id)}><i className="fa fa-pencil"></i>&nbsp; Edit product</button>
                                        <button className='delete-button' onClick={() => deleteProduct(selectedProduct.id)}><i className="fa fa-trash"></i>&nbsp; Delete product</button>
                                    </div>
                                </h3>
                                <div className="card-image">
                                    <img src={selectedProduct.picture} alt=""/>
                                </div>
                                <div className="card-description">
                                    <span>{selectedProduct.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AddProductDialog isOpen={isAddProductDialogOpen} onClose={toggleAddProductDialog} updateProducts={updateProducts} lastProductId={lastProductId} id={selectedProductId} product={selectedProduct} updateEdittedProduct={updateEdittedProduct}/>
            {window.innerWidth <= 576 && isProductDialogOpen && <ProductDialog product={selectedProduct} onClose={closeProductModal} />}
        </React.Fragment>
    );
};

export default HomePage;