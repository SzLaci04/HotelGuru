import React from "react";

function SzobaAdmin(){
    return <div className="container mt-5">
        <div className="jumbotron">
            <h3 className="display-6">Szoba admin feladatok</h3>
            <div className="row mt-5 mx-auto text-center">
                <div className="col-lg-6 col-sm-12 card p-1">
                    <div className="card-header">
                        <h5 className="card-title">
                            Szoba hozzádása
                        </h5>
                    </div>
                    <div className="card-body text-left">
                        <form>
                            <fieldset>
                                <legend>
                                    <label htmlFor="agyak_szama" className="form-label">Ágyak száma: </label>
                                </legend>
                                <input type="number" min={0} value={0} name="agyak_szama" id="agyak_szama" className="form-control"/>
                            </fieldset>
                            <fieldset>
                                <legend>
                                    <label htmlFor="ejszaka_ar" className="form-label">Egy éjszaka ára: </label>
                                </legend>
                                <input type="number" min={0} value={0} name="ejszaka_ar" id="ejszaka_ar" className="form-control"/>
                            </fieldset>
                            <fieldset>
                                <legend>
                                    <label htmlFor="statusz" className="form-label">Státusz: </label>
                                </legend>
                                <select name="statusz" id="statusz">
                                    <option value="1" key="1">Elérhető</option>
                                    <option value="3" key="2">Felújítás alatt</option>
                                </select>
                            </fieldset>
                            <fieldset>
                                <legend>
                                    <label htmlFor="felszereltseg" className="form-label">Felszereltség: </label>
                                </legend>
                                <input type="text" name="felszereltseg" id="felszereltseg" className="form-control"/>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default SzobaAdmin;