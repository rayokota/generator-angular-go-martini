package routes

import (
    "../models"
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"
    "github.com/codegangsta/martini"
    "github.com/coopernurse/gorp"
)

func Get<%= _.capitalize(pluralize(name)) %>(r *http.Request, enc Encoder, db gorp.SqlExecutor) (int, string) {
    var <%= pluralize(name) %> []models.<%= _.capitalize(name) %>
    _, err := db.Select(&<%= pluralize(name) %>, "select * from <%= pluralize(name) %> order by id")
    if err != nil {
        checkErr(err, "select failed")
        return http.StatusInternalServerError, ""
    }
    return http.StatusOK, Must(enc.Encode(<%= pluralize(name) %>toIface(<%= pluralize(name) %>)...))
}

func Get<%= _.capitalize(name) %>(enc Encoder, db gorp.SqlExecutor, parms martini.Params) (int, string) {
    id, err := strconv.Atoi(parms["id"])
    obj, _ := db.Get(models.<%= _.capitalize(name) %>{}, id)
    if err != nil || obj == nil {
        checkErr(err, "get failed")
        // Invalid id, or does not exist
        return http.StatusNotFound, ""
    }
    entity := obj.(*models.<%= _.capitalize(name) %>)
    return http.StatusOK, Must(enc.EncodeOne(entity))
}

func Add<%= _.capitalize(name) %>(w http.ResponseWriter, r *http.Request, enc Encoder, db gorp.SqlExecutor) (int, string) {
    decoder := json.NewDecoder(r.Body)
    var entity models.<%= _.capitalize(name) %>   
    decoder.Decode(&entity)
    err := db.Insert(&entity)
    if err != nil {
        checkErr(err, "insert failed")
        return http.StatusConflict, ""
    }
    w.Header().Set("Location", fmt.Sprintf("/<%= baseName %>/<%= pluralize(name) %>/%d", entity.Id))
    return http.StatusCreated, Must(enc.EncodeOne(entity))
}

func Update<%= _.capitalize(name) %>(r *http.Request, enc Encoder, db gorp.SqlExecutor, parms martini.Params) (int, string) {
    id, err := strconv.Atoi(parms["id"])
    obj, _ := db.Get(models.<%= _.capitalize(name) %>{}, id)
    if err != nil || obj == nil {
        checkErr(err, "get failed")
        // Invalid id, or does not exist
        return http.StatusNotFound, ""
    }
    oldEntity := obj.(*models.<%= _.capitalize(name) %>)

    decoder := json.NewDecoder(r.Body)
    var entity models.<%= _.capitalize(name) %>   
    decoder.Decode(&entity)
    entity.Id = oldEntity.Id
    _, err = db.Update(&entity)
    if err != nil {
        checkErr(err, "update failed")
        return http.StatusConflict, ""
    }
    return http.StatusOK, Must(enc.EncodeOne(entity))
}

func Delete<%= _.capitalize(name) %>(enc Encoder, db gorp.SqlExecutor, parms martini.Params) (int, string) {
    id, err := strconv.Atoi(parms["id"])
    obj, _ := db.Get(models.<%= _.capitalize(name) %>{}, id)
    if err != nil || obj == nil {
        checkErr(err, "get failed")
        // Invalid id, or does not exist
        return http.StatusNotFound, ""
    }
    entity := obj.(*models.<%= _.capitalize(name) %>)
    _, err = db.Delete(entity)
    if err != nil {
        checkErr(err, "delete failed")
        return http.StatusConflict, ""
    }
    return http.StatusNoContent, ""
}

func <%= pluralize(name) %>toIface(v []models.<%= _.capitalize(name) %>) []interface{} {
    if len(v) == 0 {
        return nil
    }
    ifs := make([]interface{}, len(v))
    for i, v := range v {
        ifs[i] = v
    }
    return ifs
}
