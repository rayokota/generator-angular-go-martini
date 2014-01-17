package models

import (
    "database/sql"
    "log"
    //"time"
    "github.com/coopernurse/gorp"
    _ "github.com/mattn/go-sqlite3"
)

var (
    Dbm *gorp.DbMap
)

func init() {
    log.Println("Opening db...")
    db, err := sql.Open("sqlite3", "/tmp/my.db")
    checkErr(err, "sql.Open failed")
    Dbm = &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}

    <% _.each(entities, function (entity) { %>
    Dbm.AddTableWithName(<%= _.capitalize(entity.name) %>{}, "<%= pluralize(entity.name) %>").SetKeys(true, "Id")
    <% }); %>

    //Dbm.TraceOn("[gorp]", r.INFO)
    err = Dbm.CreateTablesIfNotExists()
    checkErr(err, "Create tables failed")

}

func checkErr(err error, msg string) {
    if err != nil {
        log.Fatalln(msg, err)
    }
}
