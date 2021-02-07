Rails.application.routes.draw do
  devise_for :users,  controllers: { sessions: 'users/sessions' }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "home#index"
  post 'save_share_location', to: "home#save_share_location"
  get 'search_users', to: "home#search_users"
  get ':username', to: 'home#other_user'
end
