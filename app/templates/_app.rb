# encoding: utf-8
require 'multi_json'
require 'sinatra'
require 'data_mapper'
require 'dm-migrations'

class <%= _.capitalize(baseName) %> < Sinatra::Application
  enable :sessions

  configure :development do
    DataMapper::Logger.new($stdout, :debug)
    DataMapper.setup(
      :default,
      'sqlite:///tmp/my.db'
    )
  end

  configure :production do
    DataMapper.setup(
      :default,
      'postgres://postgres:12345@localhost/sinatra_service'
    )
  end
end

require_relative 'helpers/init'
require_relative 'models/init'
require_relative 'routes/init'

DataMapper.finalize
