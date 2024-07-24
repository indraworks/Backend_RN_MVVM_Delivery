USE udemy_delivery;

CREATE TABLE users(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(90) NOT NULL,
    lastname VARCHAR(90) NOT NULL,
    phone VARCHAR(90) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(90) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);


USE udemy_delivery;

CREATE TABLE roles(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(90) NOT NULL UNIQUE,
  image VARCHAR(255) NULL,
  route VARCHAR(100) NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  update_at TIMESTAMP(0) NOT NULL
);

INSERT INTO roles(
  name,
  route,
  created_at,
  update_at
) VALUES(
  'RESTAURANT',
  '/restaurant/orders/list',
  '2024-03-25',
  '2024-03-25'

);

INSERT INTO roles(
  name,
  route,
  created_at,
  update_at
) VALUES(
  'DELIVERY_MEN',
  '/delivery_men/orders/list',
  '2024-03-25',
  '2024-03-25'
);

INSERT INTO roles(
  name,
  route,
  created_at,
  update_at
) VALUES(
  'CLIENTS',
  '/clients/products /list',
  '2024-03-25',
  '2024-03-25'
);
DROP TABLE IF EXISTS user_has_roles CASCADE;

CREATE TABLE user_has_roles(
  id_user BIGINT NOT NULL,
  id_role BIGINT NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_role) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,  
  PRIMARY KEY(id_user,id_role) 
  --composite primary key
);

--table user_has_role harus diisi manual ! ini masalahnya! utk default smua dikasih 3 yaitu sbgai client 
--utk itu maka harus ada kita perbaiki isi tidak manual isi mulai dari awaal register.
--aggregate utk role 
USE udemy_delivery;
 SELECT 
     U.id,
     U.name,
     U.lastname,
     U.email,INT NOT NULL,INT NOT NULL,
    id_address BIGINT N
    id_address BIGINT N
     U.image,
     U.phone,
     U.password,
     JSON_ARRAYAGG(JSON_OBJECT(
       'id',R.id,
       'name',R.name,
       'image',R.image,
       'route',R.route
         
     )) AS role 
   FROM users AS U
   INNER JOIN 
   user_has_roles AS UHR
   ON U.id = UHR.id_user  
   INNER JOIN
   roles AS R 
   ON UHR.id_role = R.id
   WHERE U.email = 'indrasuryawan@gmail.com';


   --category 

CREATE TABLE categories(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL

)


--Products table 
--jadi ini 1 :N dimana 1 category jadi tamu di products jika kategory tsb didileete 
--maka smua productsnya terdelete 
---utk product ada yg hilang:ALTER TABLE t_name1 ADD FOREIGN KEY (column_name) REFERENCES t_name2(column_name)


CREATE TABLE products(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price double precision NOT NULL,
    image1 VARCHAR(255) NULL,--gak mesti ada image diantara 3 yg dimasukan 
    image2 VARCHAR(255) NULL, --gak mesti ada image diantara 3 yg dimasukan 
    image3 VARCHAR(255)  NULL,  --gak mesti ada image diantara 3 yg dimasukan 
    id_category BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE

);
--masih products utk model,controller kita copy dari categories karena mirip field2nya diganti utk crudnya ! 
--utk Order dan Prodcut nnti ada conection table karena banyak ke banyak atau N to N 
--dimana 1 product bisa dipesan banyak orang , atau 1 orang bisa pesan banyak product
--sehingga dibuat table order_has_prouduct jadi quantity hanya ada di  order_has_product table 
--jadi qunatity tidak ada di table products atau table order! 

--kita create table address jadi hubugan dgn user 1 user bisa banyak address 

CREATE TABLE address(
   id BIGINT PRIMARY KEY AUTO_INCREMENT,
   address VARCHAR(255) NOT NULL,
   neighborhood VARCHAR(180) NOT NULL,
   lat double precision  NOT NULL,
   lng double precision NOT NULL,
   created_at TIMESTAMP(0) NOT NULL,
   updated_at TIMESTAMP(0) NOT NULL, --rename colum: alter table rename column update_at to updated_at;
   id_user BIGINT NOT NULL,
   FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE 
   --reference dari table users column id 
   ---utk tanda kurung (id_user) stlah nama foreign key ini adalah penamaan pada foreignkeynya 
   ---nah yg asli refernce menunujuk pada primary key pada column dari table sumnber referncenya yaitu id pada table users!
);
---- catatan
---Please delete the UPDATE and DELETE methods that we had programmed for the model
--Category if ai like me copied and pasted from the "category.js" file only 
--leave the Address.create method as it appears in the video 
--jadi yg dari category tadi kita copy utk adress nah yg updare dan delete kita gak pakai di models address

---msalah logn lat yg kita taruh decimal kita ganti dengan cara 
--ada 2 yaitu change column dan modify column
--kalau change nama column diganti sekaligus juga type dari column 
--alter table address change column lat latitude double precision not null;

--kalau modify column mnama column tetap sama tapi typenya kita ganti contoh :
--alter table address modify column lat double precision not null;
--contoh :
--use udemy_delivery;
--alter table address modify column lat double precision not null;
--alter table address modify column lng double precision not null;
--alter table products modify column price double precision not null;

--alter table address modify column lat decimal not null;
--alter table address modify column lng decialter table address modify column lat decimal not null;mal  not null;

--kalau di copuy di paste ke myswl utk comment dihapus dulu !
CREATE TABLE orders(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_client BIGINT NOT NULL, ---ke id_user ( 1 user banuyak order)
    id_delivery BIGINT  NULL,---ke id_user dimana yg default null 
    id_address BIGINT NOT NULL, 
    lat DOUBLE PRECISION ,
    lng DOUBLE PRECISION,
    status VARCHAR(90) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,--user(id) yg punya category sbgai client
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE, --user(id) yg punya category sbgai dispatcher
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DElETE CASCADE --table addtess dari user dimana id_adress yg dipiluh oleh user jadi patokan utk dikirim 

---kalau telat tiemstamp lupa dibuat maka kita alter table add column sbb:
--alter table orders add column timestamp BIGINT NOT NULL after status;
)
--pertanyaan gimana id_delivery ke -isi dan sambung ke user_id sbb itu di users table hanya ada 1 column utk user_id!???



---ini gabungan dari table product dan table order yg N:to :N 
CREATE TABLE order_has_products(
  id_order BIGINT NOT NULL,
  id_product BIGINT NOT NULL,
  quantity BIGINT NOT NULL,
  created_at TIMESTAMP(0) NULL,
  updated_at TIMESTAMP(0) NULL,
  PRIMARY KEY(id_order,id_product),
  FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
 
)
---Jika kita create table order maka nama table di database akan jadi ditambah s 
---ut id_product yg di frontend ambil prodiuct di shoopingBagScreen

