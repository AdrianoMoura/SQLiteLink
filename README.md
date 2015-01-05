SQLiteLink
==========

A JavaScript class to manage the basic functions in HTML5 SQLite 

# Get started
```javascript
// Instance of a new SQLiteLink object
var db = new SQLiteLink().init(databaseName,version,description,size)
```
+ **databaseName (string)***: Name of your SQLite database
+ **version (string)**: Version of your SQLite database, you can use any format
+ **description (string)**: Description of your SQLite database
+ **size (int)**: Size in MB

# Methods
---
##createTable
```javascript
// Create a table if not exits
db.createTable(args, callback)
```
+ **args (array or object)**: An object or array of objects with this format:
```javascript
{
name: tableName,
    columns: [{
        name: columnName,
        type: columnType,
        primary_key: isPrimaryKey
        allow_null: ifAllowNull
    }]
}
 ```
 + **tableName (string)***: Table name
 + **columns (array)***: Table columns
   + **columnName (string)***: Column name
   + **type (string)***: Column type (NULL, INTEGER, REAL, TEXT, BLOB)
   + **primary_key (boolean)**: If your column is a primary key set this var as true, if not you wont need to set this var.
   + **allow_null (boolean)**: If your column accept null values set this var as true, if not you wont need to set this var.
+ **callback (function)**: Function will be called when createTable is successfully

####example
```javascript
// Create a table (user) with 2 columns (id, name)
db.createTable({
    name: 'User',
    columns: [{
        name: 'id',
        type: 'INTEGER',
        primary_key: true
        allow_null: false
    },{
        name: 'name',
        type: 'TEXT'
    }]
})
```
---
##insert
```javascript
// Insert a register in a specified table
db.insert(table_name, args, callback)
```
+ **table_name (string)***: Table where data will be inserted
+ **args (array or object)***: An object or array of objects will be inserted, with this format:
```javascript
{
    column_name: value,
    column_name: value,
    ...
}
```
+ **column_name (string)**: Column name
+ **value**: Value will be set in selected column
+ **callback (function)**: Function will be called when insert is successfully

####example
```javascript
// Insert a user 
db.insert('user', {
    name: 'Adriano'
})
// or, to multiples inserts
db.insert('user', [
    {
        name: 'Adriano'
    },
    {
        name: 'Adriano2'
    },
    {
        name: 'Adriano3'
    }
])
```
---
##update
```javascript
// Update an existing register in specified table
db.insert(table_name, fields, condition, callback)
```
+ **table_name (string)***: Table where the data will be updated
+ **fields (object)***: An object of columns with your respective values to update, with this format:
```javascript
{
    column_name: value,
    column_name2: value,
    ...
}
```
 + **column_name (string)**: Column name
 + **value**: Value will be set in selected column
+ **condition (array)**: Condition to limit items to update with this format
+ ```javascript
//id equals 1
[['id','=',1]]
//Name start with 'A'
[['name','LIKE','A%']]
//Or multiples conditions
[['name','LIKE','A%'],['name','!=','Adriano']]
```
+ **callback (function)**: Function will be called when update is successfully

####example
```javascript
// Update name to Brian where name start with 'Adr'
db.update('user', {
    name: 'Brian'
},[['name','LIKE','Adr%']])
```
---
##delete
```javascript
// Delete a register
db.delete(table_name, condition, callback)
```
+ **table_name (string)***: Table where the data will be deleted
+ **condition (array)**: Condition to limit items to delete with this format
```javascript
//id equals 1
[['id','=',1]]
//Name start with 'A'
[['name','LIKE','A%']]
//Or multiples conditions
[['name','LIKE','A%'],['name','!=','Adriano']]
```
+ **callback (function)**: Function will be called when delete is successfully

####example
```javascript
// Update name to Brian where name start with 'Adr'
db.delete('user', [['name','LIKE','Adr%']])
```
---
##find
```javascript
// Find register in some table
db.find(table_name, condition, sort, callback)
```
+ **table_name (string)***: Table where the data will be get
+ **condition (array)**: Condition to select items from table with this format:
```javascript
//id equals 1
[['id','=',1]]
//Name start with 'A'
[['name','LIKE','A%']]
//Or multiples conditions
[['name','LIKE','A%'],['name','!=','Adriano']]
```
+ **sort (array)**: sort condition with this format:
```javascript
//Sort by id ascending
[['id']]
//Sort by name descending
[['name','DESC']]
```
+ **callback (function)**: Function with result will be called when find is successfully

####example
```javascript
// Get registers who name start with 'Adr' order by id
db.find('user', [['name','LIKE','Adr%']], ['id'], function(data)
{
    console.log(data);
})
```
---
##findAll
```javascript
// Get all register in some table
db.findAll(table_name, sort, callback)
```
+ **table_name (string)***: Table where the data will be get
+ **sort (array)**: sort condition with this format:
```javascript
//Sort by id ascending
[['id']]
//Sort by name descending
[['name','DESC']]
```
+ **callback (function)**: Function with result will be called when findAll is successfully

####example
```javascript
// Get all registers order by id
db.find('user', ['id'], function(data)
{
    console.log(data);
})
```
---
##drop
```javascript
// Drop some table
db.drop(table_name, callback)
```
+ **table_name (string)***: Table will be droped
+ **callback (function)**: Function will be called when drop is successfully

####example
```javascript
// Drop table user
db.drop('user')
```
---
##query
```javascript
// Run SQL query on your database
db.query(sql, data, callback)
```
+ **sql (string)***: SQL query
+ **data (array)**: Data will cover ? values in query
+ **callback (function)***: Return result when query is succesfully

####example
```javascript
// Select registers with id higher then 10 and show on console
db.query('SELECT * FROM user WHERE id > ?',[10], function(data)
{
    console.log(data)
});
```