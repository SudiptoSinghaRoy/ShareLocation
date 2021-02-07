# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Creating 5 users
User.create! :username => 'user1', :email => 'user1@test.com', :password => '12345678', :password_confirmation => '12345678'
User.create! :username => 'user2', :email => 'user2@test.com', :password => '12345678', :password_confirmation => '12345678'
User.create! :username => 'user3', :email => 'user3@test.com', :password => '12345678', :password_confirmation => '12345678'
User.create! :username => 'user4', :email => 'user4@test.com', :password => '12345678', :password_confirmation => '12345678'
User.create! :username => 'user5', :email => 'user5@test.com', :password => '12345678', :password_confirmation => '12345678'

# Seeding some data of location share by user
user1_public_share = [["87.11194335937525","23.09570138667914"],["87.65027343750023","24.562913249719116"]]
user1_private_share = {"2":[["84.99158203125023","23.105806790716557"]],"3":[["84.99158203125023","23.105806790716557"],["85.39807617187523","21.326018390387205"]]}
LocationShare.create! :user_id => 1, :public_share => user1_public_share.to_json, :private_share => user1_private_share.to_json

user2_public_share = [["86.85925781250025","23.065380614867905"]]
user2_private_share = {"1":[["86.24402343750023","24.192661512720846"]],"4":[["86.24402343750023","24.192661512720846"]]}
LocationShare.create! :user_id => 2, :public_share => user2_public_share.to_json, :private_share => user2_private_share.to_json


user3_public_share = [["86.56262695312523","24.36291179184606"]]
user3_private_share = {"5":[["87.50745117187525","23.358194102023802"]]}
LocationShare.create! :user_id => 3, :public_share => user3_public_share.to_json, :private_share => user3_private_share.to_json

user4_public_share = [["85.01355468750025","22.416920745642244"]]
user4_private_share = {"5":[["87.72717773437525","22.81244240712458"]]}
LocationShare.create! :user_id => 4, :public_share => user4_public_share.to_json, :private_share => user4_private_share.to_json

