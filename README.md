# HotelGuru-15
TODO:
Számla adatbázisban való tárolása  
Saját foglalások megjelenítése frontenden (backenden is)  
Számla megjelenítése frontenden is  
Beépíteni a Foglalás táblázatba, hogy ki foglalta a szoba-t (FoglaloId)

# Felhasználó kontrollerben
// - vendég regisztráció
// - vendég bejelentkezés
// - személyes adatok módosítása (UPDATE)
// - plusz szolgáltatás megrendelése (UPDATE)
# Szoba kontrollerben
// - szobák foglaltak-e
// - szobaadatok módosítása
# Recepciós kontrollerben
// - szobafoglalás visszaigazolása
// - beléptetés
- számlaállítás
# Adminisztrátor kontroller
- felszereltség frissítése
- foglalhatóság módosítása
# Foglalás kontroller
// - szoba lefoglalása
// - foglalás lemondása
// - foglalások megtekintése

# Milyen mezővel kell kibővíteni az entitásokat?
# Felhasználó
// - jelszó
// - szerep (vendég, recepciós, admin)
# Foglalás
// - visszaigazolt-e
- lemondott-e
- fizetendő
// - foglalás kezdete
// - hány napot foglalt
// - foglalt szobák id-je
# Szoba
// - foglalható-e
// - felszereltség
