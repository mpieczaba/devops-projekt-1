require "vagrant/util/is_port_open"

module Vagrant
  module Util
    module IsPortOpen
      def is_port_open?(_host, _port)
        false
      end

      extend self
    end
  end
end
