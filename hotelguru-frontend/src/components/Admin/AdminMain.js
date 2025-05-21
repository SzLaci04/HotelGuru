import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function AdminPage() {
    return <div className="container mt-5">
        <div className="jumbotron justify-content-between align-items-center mb-4">
            <div className="row mb-5 justify-content-between">
                <div className="col-md-5 col-sm-12 mx-auto text-center card p-3">
                    <h3 className="display-6">Szoba létrehozása</h3>
                    <br />
                        <Link className="btn" style={{border:"1px solid black"}} to="/admin/szoba">
                            Szoba létrehozása
                        </Link>
                </div>
                <div className="col-md-5 col-sm-12 mx-auto text-center card p-3">
                    <h3 className="display-6">Szoba frissítése</h3>
                    <br />
                        <Link className="btn" style={{border:"1px solid black"}} to="/admin/szoba/frissites">
                            Szoba frissítés
                        </Link>
                </div>
            </div>
        </div>
    </div>
}
export default AdminPage;