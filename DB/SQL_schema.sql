USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ShoppingListDB')
BEGIN
    CREATE DATABASE ShoppingListDB;
END
GO

USE ShoppingListDB;
GO

-- מחיקת הכל ליצירה נקייה (כולל כל הפרוצדורות מהצילום)
DROP PROCEDURE IF EXISTS sp_AddItem;
DROP PROCEDURE IF EXISTS sp_GetAllItems;
DROP PROCEDURE IF EXISTS sp_GetCartItems;
DROP PROCEDURE IF EXISTS sp_GetItemById;
DROP PROCEDURE IF EXISTS sp_GetSummary;
DROP PROCEDURE IF EXISTS sp_SearchItems;
DROP PROCEDURE IF EXISTS sp_DeleteItem;
DROP PROCEDURE IF EXISTS sp_UpdateItem;
DROP PROCEDURE IF EXISTS sp_ToggleItemStatus;
DROP TABLE IF EXISTS ShoppingItems;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Statuses;
GO

-- יצירת טבלאות
CREATE TABLE Statuses (
    StatusId INT PRIMARY KEY IDENTITY(1,1), 
    StatusName NVARCHAR(50) NOT NULL      
);

CREATE TABLE Categories (
    CategoryId INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(50) NOT NULL        
);

CREATE TABLE ShoppingItems (
    Id INT PRIMARY KEY IDENTITY(1,1),          
    ItemName NVARCHAR(100) NOT NULL,           
    ItemDescription NVARCHAR(MAX),             
    StatusId INT NOT NULL DEFAULT 1,                     
    CategoryId INT NOT NULL,                   
    CreatedAt DATETIME DEFAULT GETDATE(),      
    CONSTRAINT FK_ItemStatus FOREIGN KEY (StatusId) REFERENCES Statuses(StatusId),
    CONSTRAINT FK_ItemCategory FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);
GO

-- הכנסת נתונים בסיסיים
INSERT INTO Statuses (StatusName) VALUES (N'טרם נקנה'), (N'בעגלה'), (N'בוצע');
INSERT INTO Categories (CategoryName) VALUES 
(N'חלב וביצים'), (N'ירקות ופירות'), (N'מאפייה'), (N'בשר ודגים'), (N'ניקיון'), (N'מזווה');
GO

-- הכנסת נתונים התחלתיים לסל
INSERT INTO ShoppingItems (ItemName, ItemDescription, CategoryId, StatusId) VALUES 
(N'חלב 3%', N'חלב וביצים', 1, 1),
(N'גבינה צהובה', N'חלב וביצים', 1, 2),
(N'ביצים L', N'חלב וביצים', 1, 1),
(N'עגבניה', N'ירקות ופירות', 2, 1),
(N'מלפפון', N'ירקות ופירות', 2, 1),
(N'בננה', N'ירקות ופירות', 2, 2),
(N'חלה לשבת', N'מאפייה', 3, 1),
(N'חזה עוף', N'בשר ודגים', 4, 1),
(N'נוזל כלים', N'ניקיון', 5, 1),
(N'אורז', N'מזווה', 6, 1);
GO

-- יצירת הפרוצדורות (לפי הרשימה בצילום המסך)

CREATE PROCEDURE sp_AddItem
    @ItemName NVARCHAR(100),
    @ItemDescription NVARCHAR(MAX) = '',
    @CategoryId INT,
    @StatusId INT = 1
AS
BEGIN
    INSERT INTO ShoppingItems (ItemName, ItemDescription, CategoryId, StatusId, CreatedAt)
    VALUES (@ItemName, @ItemDescription, @CategoryId, @StatusId, GETDATE());
END
GO

CREATE PROCEDURE sp_GetAllItems
AS
BEGIN
    SELECT I.*, C.CategoryName, S.StatusName FROM ShoppingItems I
    JOIN Categories C ON I.CategoryId = C.CategoryId
    JOIN Statuses S ON I.StatusId = S.StatusId
    ORDER BY I.CreatedAt DESC;
END
GO

CREATE PROCEDURE sp_GetCartItems
AS
BEGIN
    SELECT * FROM ShoppingItems WHERE StatusId = 2;
END
GO

CREATE PROCEDURE sp_GetItemById
    @Id INT
AS
BEGIN
    SELECT * FROM ShoppingItems WHERE Id = @Id;
END
GO

CREATE PROCEDURE sp_GetSummary
AS
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM ShoppingItems) AS TotalItems,
        (SELECT COUNT(*) FROM ShoppingItems WHERE StatusId = 2) AS CompletedItems;
END
GO

CREATE PROCEDURE sp_SearchItems
    @Term NVARCHAR(100)
AS
BEGIN
    SELECT * FROM ShoppingItems WHERE ItemName LIKE '%' + @Term + '%';
END
GO

CREATE PROCEDURE sp_ToggleItemStatus
    @Id INT
AS
BEGIN
    UPDATE ShoppingItems SET StatusId = CASE WHEN StatusId = 1 THEN 2 ELSE 1 END WHERE Id = @Id;
END
GO

CREATE PROCEDURE sp_UpdateItem
    @Id INT,
    @ItemName NVARCHAR(100),
    @ItemDescription NVARCHAR(MAX) = '',
    @CategoryId INT,
    @StatusId INT = 1
AS
BEGIN
    UPDATE ShoppingItems 
    SET ItemName = @ItemName, ItemDescription = @ItemDescription, CategoryId = @CategoryId, StatusId = @StatusId
    WHERE Id = @Id;
END
GO

CREATE PROCEDURE sp_DeleteItem
    @Id INT
AS
BEGIN
    DELETE FROM ShoppingItems WHERE Id = @Id;
END
GO

-- בדיקה שהכל תקין
SELECT N'המערכת מוכנה עם כל הפרוצדורות מהצילום!' AS Status;