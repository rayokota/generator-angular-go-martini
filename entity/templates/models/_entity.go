package models

import "time"

var date time.Time

type <%= _.capitalize(name) %> struct {
    Id int `json:"id"`
    <% _.each(attrs, function (attr) { %>
    <%= _.capitalize(attr.attrName) %> <% if (attr.attrType == 'Enum') { %>string<% } else { %><%= attr.attrImplType %><% }; %> `json:"<%= attr.attrName %>"`
  <% }); %>
}
