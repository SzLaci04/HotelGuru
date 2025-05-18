import React from "react";
import { Link,useNavigate,useLocation } from "react-router-dom";
function AdminPage(){


    
   return <div className="container mt-5">
        <div className="jumbotron justify-content-between align-items-center mb-4">
            <div className="row mb-5 justify-content-between">
                <div className="col-md-5 col-sm-12 mx-auto text-center card p-3">
                    <h3 className="display-6">Szoba feladatok</h3>
                    <br />
                    <button>
                        <Link className="btn" to="/admin/szoba">
                        Szoba adminisztrációs felület
                        </Link>
                    </button>
                </div>
                <div className="col-md-5 col-sm-12 mx-auto text-center card p-3">
                    <h3 className="display-6">Felhasználó feladatok</h3>
                    <br />
                    <button>
                        <Link className="btn" to="/admin/felhasznalo">
                        Felhasználó adminisztrációs felület
                        </Link>
                    </button>
                </div>
            </div>
            <div className="row mb-5 justify-content-between">
                <div className="col-md-5 col-sm-12 mx-auto text-center card p-3">
                    <h3 className="display-6">Foglalás feladatok</h3>
                    <br />
                    <button>
                        <Link className="btn" to="/admin/foglalas">
                        Foglalás adminisztrációs felület
                        </Link>
                    </button>
                </div>
                <div className="col-md-5 col-sm-12 mx-auto text-center card p-3">
                    <h3 className="display-6">Plusz szolgáltatás feladatok</h3>
                    <br />
                    <button>
                        <Link className="btn" to="/admin/pluszszolg">
                            Plusz szolgáltatás adminisztrációs felület
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    </div>
}
export default AdminPage;