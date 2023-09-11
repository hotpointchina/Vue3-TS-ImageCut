FROM 192.101.10.113/public/nginx:1.18

MAINTAINER kakusilong@163.com

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN mkdir -p /cpvf-pools-main

WORKDIR /cpvf-pools-main

VOLUME /tmp
ENV LANG en_US.UTF-8
ADD ./dist/ /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443
