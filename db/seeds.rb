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
user1_public_share = [[89.36987792968776, 23.56444466587645],[88.35339843750025, 22.58946741614342]]
user1_private_share = {'user2' => [[85.36987792968776, 20.56444466587645],[84.36987792968776, 21.56444466587645]]}
LocationShare.create! :user_id => 1, :public_share => user1_public_share.to_json, :private_share => user1_private_share.to_json
