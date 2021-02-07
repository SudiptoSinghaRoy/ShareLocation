class LocationShare < ApplicationRecord
    def self.get_public_share_locations(user_id)
        location_share_obj = LocationShare.where(:user_id => user_id).select(:public_share).take
        public_share_locations = nil
        public_share_locations = location_share_obj.public_share if location_share_obj.present?
        public_share_locations = '[]' if public_share_locations.nil?
        return JSON.parse(public_share_locations)
    end

    def self.get_private_share_locations(user_id)
        location_share_obj = LocationShare.where(:user_id => user_id).select(:private_share).take
        private_share_locations = nil
        private_share_locations = location_share_obj.private_share if location_share_obj.present?
        private_share_locations = '{}' if private_share_locations.nil?
        return JSON.parse(private_share_locations)
    end

    def self.get_location_share_with_me(user_id)
        location_share_obj = LocationShare.where.not(:user_id => user_id)
        return_obj = {}
        if location_share_obj.present?
            location_share_obj.each do |lso|
                private_share = {}
                private_share = JSON.parse(lso.private_share) if lso.private_share.present?
                if private_share.keys.length > 0
                    user_id_arr = private_share.keys
                    if user_id_arr.include?(user_id.to_s)
                        inner_arr = private_share[user_id.to_s]
                        username = User.find(lso.user_id).username
                        return_obj[username] = inner_arr
                    end
                end
            end
        end
        return return_obj
    end

    def self.save_share_location(sharetype, users_to_share, coordinate_to_share, share_by)
        location_share_obj = LocationShare.where(:user_id => share_by).take
        location_share_obj = LocationShare.new if location_share_obj.nil?
        location_share_obj.user_id = share_by if location_share_obj.user_id.nil?
        if sharetype == 'privately'
            private_share_locations = location_share_obj.private_share
            private_share_locations = '{}' if private_share_locations.nil?
            private_share = JSON.parse(private_share_locations)
            users_to_share.each do |user|
                user_loc_arr = []
                user_loc_arr = private_share[user] if private_share[user].present?
                user_loc_arr << coordinate_to_share
                private_share[user] = user_loc_arr
            end
            location_share_obj.private_share = private_share.to_json
        elsif sharetype == 'publicly'
            public_share_locations = location_share_obj.public_share
            public_share_locations = '[]' if public_share_locations.nil?
            public_share = JSON.parse(public_share_locations)
            public_share << coordinate_to_share
            location_share_obj.public_share = public_share.to_json
        end
        if location_share_obj.save
            return true
        else
            return false
        end        
    end
end
