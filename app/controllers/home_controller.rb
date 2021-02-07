class HomeController < ApplicationController
    before_action :authenticate_user!
    def index
        @users = User.all
        @current_user_share_location = {}
        @current_user_share_location['publicly'] = LocationShare.get_public_share_locations(current_user.id)
        @current_user_share_location['privately'] = LocationShare.get_private_share_locations(current_user.id)
        @location_share_with_me = LocationShare.get_location_share_with_me(current_user.id)
    end

    def save_share_location
        sharetype = params[:sharetype]
        users_to_share = []
        users_to_share = params[:user_to_share].split(',') if sharetype == 'privately'
        coordinate_to_share = params[:coordinate_to_share].split(',')
        share_by = current_user.id
        is_share_success = LocationShare.save_share_location(sharetype, users_to_share, coordinate_to_share, share_by)
        if is_share_success
            msg = "You share the location successfully"
        else
            msg = "Something went wrong, location can not be shared"
        end    
        render plain: msg
    end

    def search_users
        search_value = params[:search_value].strip
        result_arr = User.search_users(search_value)
        render json: result_arr
    end

    def other_user
        @username = params[:username]
        user_id = User.find_by(:username => @username).id
        @this_user_sharing_locations = {}
        @this_user_sharing_locations['publicly'] = LocationShare.get_public_share_locations(user_id)
    end
end
