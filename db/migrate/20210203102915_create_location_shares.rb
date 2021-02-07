class CreateLocationShares < ActiveRecord::Migration[6.1]
  def change
    create_table :location_shares do |t|
      t.integer :user_id
      t.text :public_share
      t.text :private_share

      t.timestamps
    end
  end
end
