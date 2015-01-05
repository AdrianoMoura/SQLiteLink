var SQLiteLink = function ()
{
    var _db = {};

    this.init = function (name, version, description, size)
    {
        open(name, version, description, size);

        return this;
    };

    var open = function (name, version, description, size)
    {
        if (name === undefined)
            throw new Error('Database name is not defined');
        if (version === undefined)
            version = 1;
        if (description === undefined)
            description = '';
        if (size === undefined)
            size = 5;

        if (window.openDatabase)
        {
            var dbSize = size * 1024 * 1024;
            _db = openDatabase(name, version, description, dbSize);
            if (!_db)
                throw new Error("Error Failed to open the database, check version");
        }
        else
            throw new Error("Database not supported");
    };

    this.createTable = function (json_db, callback)
    {
        if (json_db === undefined)
            throw new Error('Data is not defined');
        if (callback === undefined)
            callback = function (tx, e, str) {
            };

        if (!Array.isArray(json_db))
        {
            json_db = [json_db];
        }

        _db.transaction(function (tx)
        {
            for (var table in json_db)
            {
                var str = '';
                str = str + 'CREATE TABLE IF NOT EXISTS ' + json_db[table].name + '(';

                for (var column in json_db[table].columns)
                {
                    str = str + json_db[table].columns[column].name + ' ' + json_db[table].columns[column].type;

                    if (json_db[table].columns[column].primary_key)
                        str = str + ' PRIMARY KEY';
                    if (!json_db[table].columns[column].allow_null || json_db[table].columns[column].allow_null === undefined)
                        str = str + ' NOT NULL';

                    str = str + ', ';
                }

                str = str.substr(0, str.length - 2);

                str = str + ')';

                tx.executeSql(str, [], function (tx, e)
                {
                    callback(tx, e, str);
                }, onError);
            }
        });
    };

    this.insert = function (table, itens, callback)
    {
        if (table === undefined)
            throw new Error('Table is not defined');
        if (itens === undefined)
            throw new Error('Itens is not defined');
        if (callback === undefined)
            callback = function (tx, e, str, data) {
            };

        _db.transaction(function (tx)
        {
            if (!Array.isArray(itens))
            {
                itens = [itens];
            }

            for (var item in itens)
            {
                var str = '';
                var data = [];

                str += 'INSERT INTO ' + table + '(';
                for (var value in itens[item])
                {
                    str += value + ', ';
                }

                str = str.substr(0, str.length - 2);

                str += ') VALUES(';

                for (var value in itens[item])
                {
                    data.push(itens[item][value]);

                    str += '?, ';
                }

                str = str.substr(0, str.length - 2);

                str += ')';
                tx.executeSql(str, data, function (tx, e)
                {
                    callback(tx, e, str, data);
                }, onError);
            }
        });
    };

    this.update = function (table, value, condition, callback)
    {
        if (table === undefined)
            throw new Error('Table is not defined');
        if (value === undefined)
            throw new Error('Value is not defined');
        if (condition === undefined)
            condition = [];
        if (callback === undefined)
            callback = function (tx, e, str) {
            };

        var str = '';

        str += 'UPDATE ' + table + ' SET ';

        for (var item in value)
        {
            if (typeof value[item] === 'string')
                value[item] = '"' + value[item] + '"';

            str += item + ' = ' + value[item] + ', ';
        }

        str = str.substr(0, str.length - 2);

        if (condition.length > 0)
            str += ' WHERE ';

        for (var item in condition)
        {
            if (typeof condition[item][2] === 'string')
                condition[item][2] = '"' + condition[item][2] + '"';

            str += condition[item][0] + ' ' + condition[item][1] + ' ' + condition[item][2] + ' AND ';
        }

        if (condition.length > 0)
            str = str.substr(0, str.length - 5);

        this.query(str, [], function (data, str)
        {
            callback(data, str);
        });
    };

    this.delete = function (table, condition, callback)
    {
        if (table === undefined)
            throw new Error('Table is not defined');
        if (condition === undefined)
            condition = [];
        if (callback === undefined)
            callback = function (data) {
            };

        _db.transaction(function (tx)
        {
            var str = 'DELETE FROM ' + table + ' WHERE ';

            if (condition.length > 0)
            {
                for (var item in condition)
                {
                    if (typeof condition[item][2] === 'string')
                        condition[item][2] = '"' + condition[item][2] + '"';

                    str += condition[item][0] + ' ' + condition[item][1] + ' ' + condition[item][2] + ' AND ';
                }

                str = str.substr(0, str.length - 5);
            }
            else
                str = str.substr(0, str.length - 7);

            tx.executeSql(str, [], function (tx, rx) {
                var data = [];

                for (var i = 0; i < rx.rows.length; i++)
                {
                    data.push(rx.rows.item(i));
                }

                callback(data);
            }, onError);
        });
    };

    this.find = function (table, find, order, callback)
    {
        if (table === undefined)
            throw new Error('Table is not defined');
        if (find === undefined)
            find = [];
        if (order === undefined)
            order = [];
        if (callback === undefined)
            callback = function (data, str) {
            };

        _db.transaction(function (tx)
        {
            var str = 'SELECT * FROM ' + table;

            if (find.length > 0)
                str += ' WHERE ';

            for (var item in find)
            {
                if (typeof find[item][2] === 'string')
                    find[item][2] = '"' + find[item][2] + '"';

                str += find[item][0] + ' ' + find[item][1] + ' ' + find[item][2] + ' AND ';
            }

            if (find.length > 0)
                str = str.substr(0, str.length - 5);

            if (order.length > 0)
            {
                str += ' ORDER BY ';

                for (var item in order)
                {
                    if (order[item][0] !== undefined)
                    {
                        str += order[item][0];

                        if (order[item][1] !== undefined)
                            str += ' ' + order[item][1] + ', ';
                        else
                        {
                            str += ' ASC, ';
                        }
                    }
                }

                str = str.substr(0, str.length - 2);
            }

            tx.executeSql(str, [], function (tx, rx) {
                var data = [];

                for (var i = 0; i < rx.rows.length; i++)
                {
                    data.push(rx.rows.item(i));
                }

                callback(data, str);
            }, onError);
        });
    };

    this.drop = function (table, callback)
    {
        if (table === undefined)
            throw new Error('Table is not defined');
        if (callback === undefined)
            callback = function (data, str) {
            };


        if (!Array.isArray(table))
        {
            table = [table];
        }

        var data = [];
        var strA = [];

        _db.transaction(function (tx)
        {
            for (var t in table)
            {
                var str = 'DROP TABLE ' + table[t];

                strA.push(str);

                tx.executeSql(str, [], function (tx, rx)
                {
                    data.push(rx);
                }, onError);
            }
        });

        callback(data, strA);
    };

    this.findAll = function (table, order, callback)
    {
        if (table === undefined)
            throw new Error('Table is not defined');
        if (order === undefined)
            order = [];
        if (callback === undefined)
            callback = function (data) {
            };

        _db.transaction(function (tx)
        {
            var str = 'SELECT * FROM ' + table;
            
            if (order.length > 0)
            {
                str += ' ORDER BY ';

                for (var item in order)
                {
                    if (order[item][0] !== undefined)
                    {
                        str += order[item][0];

                        if (order[item][1] !== undefined)
                            str += ' ' + order[item][1] + ', ';
                        else
                        {
                            str += ' ASC, ';
                        }
                    }
                }

                str = str.substr(0, str.length - 2);
            }

            tx.executeSql(str, [], function (tx, rx) {
                var data = [];

                for (var i = 0; i < rx.rows.length; i++)
                {
                    data.push(rx.rows.item(i));
                }

                callback(str, data);
            }, onError);
        });
    };

    this.query = function (sql, data, callback)
    {
        if (sql === undefined)
            throw new Error('SQL is not defined');
        if (data === undefined)
            data = [];
        if (callback === undefined)
            callback = function (data) {
            };

        _db.transaction(function (tx)
        {
            tx.executeSql(sql, data, function (tx, rx) {
                var data = [];

                for (var i = 0; i < rx.rows.length; i++)
                {
                    data.push(rx.rows.item(i));
                }

                callback(data, sql);
            }, onError);
        });
    };

    var onError = function (tx, e)
    {
        throw new Error(e.message);
    };
};